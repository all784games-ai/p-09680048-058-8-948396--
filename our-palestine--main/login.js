(() => {
    const accountsKey = 'ourPalestineAccounts';
    const sessionKey = 'ourPalestineSession';
    const form = document.getElementById('account-form');
    const signInTab = document.getElementById('sign-in-tab');
    const createAccountTab = document.getElementById('create-account-tab');
    const adminTab = document.getElementById('admin-tab');
    const nameField = document.getElementById('name-field');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const emailLabel = document.getElementById('email-label');
    const passwordInput = document.getElementById('password');
    const confirmField = document.getElementById('confirm-field');
    const confirmInput = document.getElementById('confirm-password');
    const submitButton = document.getElementById('submit-account');
    const message = document.getElementById('form-message');
    const guestButton = document.getElementById('guest-button');
    let isCreatingAccount = false;
    let isAdminSignIn = false;

    function setMessage(text) {
        message.textContent = text;
    }

    function setMode(createAccount, adminSignIn = false) {
        isCreatingAccount = createAccount;
        isAdminSignIn = adminSignIn;
        emailLabel.textContent = adminSignIn ? 'Admin username' : 'Email address';
        emailInput.type = adminSignIn ? 'text' : 'email';
        emailInput.autocomplete = adminSignIn ? 'username' : 'email';
        emailInput.placeholder = adminSignIn ? 'admin' : '';
        nameField.hidden = !createAccount;
        nameInput.disabled = !createAccount;
        nameInput.required = createAccount;
        emailInput.required = true;
        confirmField.hidden = !createAccount;
        confirmInput.disabled = !createAccount;
        confirmInput.required = createAccount;
        passwordInput.autocomplete = createAccount ? 'new-password' : 'current-password';
        passwordInput.minLength = adminSignIn ? 0 : 8;
        signInTab.classList.toggle('is-active', !createAccount && !adminSignIn);
        createAccountTab.classList.toggle('is-active', createAccount);
        adminTab.classList.toggle('is-active', adminSignIn);
        signInTab.setAttribute('aria-pressed', String(!createAccount && !adminSignIn));
        createAccountTab.setAttribute('aria-pressed', String(createAccount));
        adminTab.setAttribute('aria-pressed', String(adminSignIn));
        submitButton.textContent = createAccount ? 'Create account' : adminSignIn ? 'Admin sign in' : 'Sign in';
        setMessage('');
    }

    function readAccounts() {
        const savedAccounts = localStorage.getItem(accountsKey);
        if (!savedAccounts) {
            return [];
        }

        const accounts = JSON.parse(savedAccounts);
        if (!Array.isArray(accounts)) {
            throw new Error('Saved account data has an invalid format.');
        }

        return accounts;
    }

    async function hashPassword(password, salt) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error('Secure browser cryptography is unavailable. Open this site on localhost or HTTPS to use accounts.');
        }

        const key = await window.crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(password),
            'PBKDF2',
            false,
            ['deriveBits']
        );
        const hash = await window.crypto.subtle.deriveBits({
            name: 'PBKDF2',
            salt: new TextEncoder().encode(salt),
            iterations: 210000,
            hash: 'SHA-256'
        }, key, 256);
        return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    function createSalt() {
        if (!window.crypto || !window.crypto.getRandomValues) {
            throw new Error('Secure browser random values are unavailable. Open this site on localhost or HTTPS to use accounts.');
        }

        return Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('');
    }

    function getDestination() {
        const requestedDestination = new URLSearchParams(window.location.search).get('next');
        if (requestedDestination) {
            try {
                const destination = new URL(requestedDestination, window.location.href);
                const loginDirectory = new URL('.', window.location.href).pathname;
                if (destination.origin === window.location.origin &&
                    destination.pathname.startsWith(loginDirectory) &&
                    destination.pathname.endsWith('.html') &&
                    !destination.pathname.endsWith('login.html')) {
                    return destination.href;
                }
            } catch (error) {
                console.error('Could not use the requested post-login destination.', error);
            }
        }

        return new URL(isAdminSignIn ? 'admin.html' : 'my-palistain.html', window.location.href).href;
    }

    function startSession(name, email, guest = false, admin = false) {
        localStorage.setItem(sessionKey, JSON.stringify({ name, email, guest, admin }));
        window.location.replace(getDestination());
    }

    signInTab.addEventListener('click', () => setMode(false));
    createAccountTab.addEventListener('click', () => setMode(true));
    adminTab.addEventListener('click', () => setMode(false, true));

    if (new URLSearchParams(window.location.search).has('blocked')) {
        setMessage('This account has been blocked. Contact the site administrator for help.');
    }

    guestButton.addEventListener('click', () => {
        try {
            startSession('Guest', '', true);
        } catch (error) {
            console.error('Could not start a guest session.', error);
            setMessage('We could not start guest access. Please check that browser storage is available.');
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        setMessage('');

        if (!form.reportValidity()) {
            return;
        }

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        try {
            if (isAdminSignIn) {
                if (emailInput.value.trim() === 'admin' && password === 'admin') {
                    startSession('Administrator', 'admin', false, true);
                } else {
                    setMessage('Admin username or password is incorrect.');
                }
                return;
            }

            const accounts = readAccounts();

            if (isCreatingAccount) {
                const name = nameInput.value.trim();
                if (!name) {
                    setMessage('Please enter your name.');
                    nameInput.focus();
                    return;
                }
                if (password.length < 8) {
                    setMessage('Choose a password with at least 8 characters.');
                    passwordInput.focus();
                    return;
                }
                if (password !== confirmInput.value) {
                    setMessage('The passwords do not match.');
                    confirmInput.focus();
                    return;
                }
                if (accounts.some((account) => account.email === email)) {
                    setMessage('An account with this email already exists. Please sign in instead.');
                    return;
                }

                const salt = createSalt();
                const passwordHash = await hashPassword(password, salt);
                accounts.push({ name, email, salt, passwordHash });
                localStorage.setItem(accountsKey, JSON.stringify(accounts));
                startSession(name, email);
                return;
            }

            const account = accounts.find((savedAccount) => savedAccount.email === email);
            if (!account || (await hashPassword(password, account.salt)) !== account.passwordHash) {
                setMessage('Email or password is incorrect.');
                return;
            }
            if (account.blocked === true) {
                setMessage('This account has been blocked. Contact the site administrator for help.');
                return;
            }

            startSession(account.name, account.email);
        } catch (error) {
            console.error('Could not complete the account action.', error);
            setMessage(error instanceof Error
                ? error.message
                : 'We could not complete this action. Please check that browser storage is available.');
        }
    });
})();
