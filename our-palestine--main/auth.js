(() => {
    const sessionKey = 'ourPalestineSession';
    const loginUrl = new URL('login.html', document.currentScript.src);
    const isLoginPage = window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('login.html');
    const isAdminPage = window.location.pathname.endsWith('/admin.html') || window.location.pathname.endsWith('admin.html');

    function readSession() {
        const value = localStorage.getItem(sessionKey);
        if (!value) {
            return null;
        }

        const session = JSON.parse(value);
        if (!session || typeof session.name !== 'string' || typeof session.guest !== 'boolean') {
            throw new Error('The saved session has an invalid format.');
        }

        return session;
    }

    if (isLoginPage) {
        return;
    }

    let session;
    try {
        session = readSession();
    } catch (error) {
        console.error('Could not read the saved sign-in session.', error);
    }

    if (!session) {
        const next = new URL(window.location.href);
        loginUrl.searchParams.set('next', next.href);
        window.location.replace(loginUrl.href);
        return;
    }

    if (isAdminPage && session.admin !== true) {
        window.location.replace(new URL('my-palistain.html', document.currentScript.src).href);
        return;
    }

    if (!session.admin && !session.guest && session.email) {
        try {
            const accounts = JSON.parse(localStorage.getItem('ourPalestineAccounts') || '[]');
            const account = accounts.find((savedAccount) => savedAccount.email === session.email);
            if (account && account.blocked === true) {
                localStorage.removeItem(sessionKey);
                loginUrl.searchParams.set('blocked', '1');
                window.location.replace(loginUrl.href);
                return;
            }
        } catch (error) {
            console.error('Could not verify the saved account status.', error);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.querySelector('.nav');
        const languageToggle = document.getElementById('lang-toggle');
        if (!nav || !languageToggle) {
            return;
        }

        const accountControl = document.createElement('div');
        accountControl.className = 'account-control';

        const accountName = document.createElement('span');
        accountName.className = 'account-name';
        accountName.textContent = session.guest ? 'Guest' : session.name;
        if (session.guest) {
            accountName.dataset.i18n = 'auth.guest';
        }
        accountControl.appendChild(accountName);

        if (session.admin) {
            const adminLink = document.createElement('a');
            adminLink.className = 'account-admin-link';
            adminLink.href = new URL('admin.html', loginUrl).href;
            adminLink.textContent = 'Admin';
            accountControl.appendChild(adminLink);
        }

        const signOutButton = document.createElement('button');
        signOutButton.className = 'account-sign-out';
        signOutButton.type = 'button';
        signOutButton.textContent = session.guest ? 'Leave guest' : 'Sign out';
        signOutButton.dataset.i18n = session.guest ? 'auth.leaveGuest' : 'auth.signOut';
        signOutButton.addEventListener('click', () => {
            localStorage.removeItem(sessionKey);
            window.location.replace(loginUrl.href);
        });
        accountControl.appendChild(signOutButton);

        nav.insertBefore(accountControl, languageToggle);
    });
})();
