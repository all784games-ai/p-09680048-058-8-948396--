(() => {
    const keys = {
        overrides: 'ourPalestineOverrides',
        navigation: 'ourPalestineHiddenNavigation',
        submissions: 'ourPalestineSubmissions',
        news: 'ourPalestineNews',
        games: 'ourPalestineGames',
        feedback: 'ourPalestineFeedback',
        releaseNotes: 'ourPalestineReleaseNotes'
    };
    const defaultReleaseNotes = [
        {
            id: 'release-0-3-0',
            version: '0.3.0',
            title: 'Community updates',
            text: 'Added community suggestions and feedback review, published news and game cards, and controls for approving changes.',
            date: '2026-11-05'
        },
        {
            id: 'release-0-2-0',
            version: '0.2.0',
            title: 'Sign-in and community tools',
            text: 'Added account creation, sign-in, and guest access, plus an admin dashboard for managing members and site settings.',
            date: '2026-11-05'
        },
        {
            id: 'release-0-1-0',
            version: '0.1.0',
            title: 'The website is here',
            text: 'Explore the homepage, Palestinian culture, community services, games, market, and map.',
            date: '2026-11-05'
        }
    ];
    const originalText = {
        brand: 'our Palestine',
        'hero.title': 'A website by Palestinians, for Palestinians.',
        'hero.text': 'This is a beta version. Please help us improve it.',
        'about.title': 'About',
        'about.text': 'This page is made by Palestinians, for Palestinians, to help build a better future for our country.',
        'services.title': 'Services',
        'contact.title': 'Contact'
    };
    const formKeys = ['brand', 'hero.title', 'hero.text', 'about.title', 'about.text', 'services.title', 'contact.title'];
    const pageNames = {
        'hero.title': 'Home headline',
        'hero.text': 'Home introduction',
        'about.title': 'Home About heading',
        'about.text': 'Home About text',
        'contact.title': 'Home Contact heading',
        'map.html': 'Map page',
        'market.html': 'Market page',
        'services.html': 'Services page'
    };
    const message = document.getElementById('admin-message');
    const panels = Array.from(document.querySelectorAll('.admin-panel'));
    const tabs = Array.from(document.querySelectorAll('.admin-tab'));

    function loadList(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return [];
        }

        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
            throw new Error(`Saved data for ${key} is not a list.`);
        }
        return parsed;
    }

    function saveList(key, list) {
        localStorage.setItem(key, JSON.stringify(list));
    }

    function loadReleaseNotes() {
        const savedNotes = localStorage.getItem(keys.releaseNotes);
        if (!savedNotes) {
            saveList(keys.releaseNotes, defaultReleaseNotes);
            return defaultReleaseNotes;
        }
        return loadList(keys.releaseNotes);
    }

    function loadObject(key) {
        const value = localStorage.getItem(key);
        if (!value) {
            return {};
        }
        const parsed = JSON.parse(value);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            throw new Error(`Saved data for ${key} is not an object.`);
        }
        return parsed;
    }

    function showMessage(text) {
        message.textContent = text;
    }

    function makeButton(text, action, style = '') {
        const button = document.createElement('button');
        button.className = `button ${style}`.trim();
        button.type = 'button';
        button.textContent = text;
        button.addEventListener('click', action);
        return button;
    }

    function emptyState(text) {
        const empty = document.createElement('p');
        empty.className = 'empty-list';
        empty.textContent = text;
        return empty;
    }

    function renderRecords(container, records, createCard, emptyText) {
        container.replaceChildren();
        if (records.length === 0) {
            container.appendChild(emptyState(emptyText));
            return;
        }
        records.forEach((record, index) => container.appendChild(createCard(record, index)));
    }

    function createRecordCard(title, text, meta, actions = []) {
        const card = document.createElement('article');
        card.className = 'record-card';
        const content = document.createElement('div');
        const heading = document.createElement('h3');
        heading.textContent = title;
        content.appendChild(heading);
        if (text) {
            const body = document.createElement('p');
            body.textContent = text;
            content.appendChild(body);
        }
        if (meta) {
            const details = document.createElement('div');
            details.className = 'record-meta';
            details.textContent = meta;
            content.appendChild(details);
        }
        card.appendChild(content);
        if (actions.length) {
            const controls = document.createElement('div');
            controls.className = 'record-actions';
            actions.forEach((button) => controls.appendChild(button));
            card.appendChild(controls);
        }
        return card;
    }

    function readAccounts() {
        const value = localStorage.getItem('ourPalestineAccounts');
        if (!value) {
            return [];
        }
        const accounts = JSON.parse(value);
        if (!Array.isArray(accounts)) {
            throw new Error('Saved member data is not a list.');
        }
        return accounts;
    }

    function renderMembers() {
        const accounts = readAccounts();
        renderRecords(document.getElementById('member-list'), accounts, (account, index) => {
            const blocked = account.blocked === true;
            const toggle = makeButton(blocked ? 'Unblock' : 'Block', () => {
                const updated = readAccounts();
                updated[index].blocked = !blocked;
                saveList('ourPalestineAccounts', updated);
                renderAll();
                showMessage(blocked ? 'Member unblocked.' : 'Member blocked.');
            }, blocked ? '' : 'button-danger');
            const remove = makeButton('Remove', () => {
                if (!window.confirm(`Remove the account for ${account.email}?`)) {
                    return;
                }
                const updated = readAccounts();
                updated.splice(index, 1);
                saveList('ourPalestineAccounts', updated);
                renderAll();
                showMessage('Member account removed.');
            }, 'button-danger');
            return createRecordCard(account.name || 'Member', account.email, blocked ? 'Blocked' : 'Active', [toggle, remove]);
        }, 'No member accounts yet.');
    }

    function renderReview() {
        const submissions = loadList(keys.submissions);
        renderRecords(document.getElementById('review-list'), submissions, (submission, index) => {
            const typeName = { edit: 'Text suggestion', news: 'News suggestion', game: 'Game suggestion', feedback: 'Feedback' }[submission.type] || 'Submission';
            const text = submission.type === 'edit' ? `${pageNames[submission.key] || submission.key}: ${submission.text}` : submission.text;
            const approve = makeButton(submission.type === 'feedback' ? 'Archive' : 'Approve', () => {
                const pending = loadList(keys.submissions);
                const selected = pending[index];
                if (selected.type === 'news') {
                    const news = loadList(keys.news);
                    news.unshift({ id: selected.id, title: selected.title, text: selected.text, date: selected.date });
                    saveList(keys.news, news);
                } else if (selected.type === 'game') {
                    const games = loadList(keys.games);
                    games.unshift({ id: selected.id, title: selected.title, description: selected.text, href: 'game.html' });
                    saveList(keys.games, games);
                } else if (selected.type === 'edit') {
                    let overrides;
                    try {
                        overrides = loadObject(keys.overrides);
                    } catch (error) {
                        console.error('Could not approve the text suggestion because saved settings are invalid.', error);
                        showMessage('The text suggestion could not be approved because saved site text is invalid.');
                        return;
                    }
                    overrides[selected.key] = selected.text;
                    saveList(keys.overrides, overrides);
                } else if (selected.type === 'feedback') {
                    const feedback = loadList(keys.feedback);
                    feedback.unshift(selected);
                    saveList(keys.feedback, feedback);
                }
                pending.splice(index, 1);
                saveList(keys.submissions, pending);
                renderAll();
                showMessage(submission.type === 'feedback' ? 'Feedback archived.' : 'Change approved and published.');
            });
            const reject = makeButton('Reject', () => {
                const pending = loadList(keys.submissions);
                pending.splice(index, 1);
                saveList(keys.submissions, pending);
                renderAll();
                showMessage('Submission rejected.');
            }, 'button-danger');
            return createRecordCard(submission.title || typeName, text, `${typeName} · ${submission.name || 'Community member'} · ${submission.date || ''}`, [approve, reject]);
        }, 'No changes are waiting for review.');
    }

    function renderNewsAndGames() {
        const news = loadList(keys.news);
        const games = loadList(keys.games);
        renderRecords(document.getElementById('published-news'), news, (item, index) => {
            const remove = makeButton('Remove', () => {
                const updated = loadList(keys.news);
                updated.splice(index, 1);
                saveList(keys.news, updated);
                renderAll();
                showMessage('News item removed.');
            }, 'button-danger');
            return createRecordCard(item.title, item.text, item.date || '', [remove]);
        }, 'No news published yet.');
        renderRecords(document.getElementById('published-games'), games, (item, index) => {
            const remove = makeButton('Remove', () => {
                const updated = loadList(keys.games);
                updated.splice(index, 1);
                saveList(keys.games, updated);
                renderAll();
                showMessage('Game removed.');
            }, 'button-danger');
            return createRecordCard(item.title, item.description, item.href, [remove]);
        }, 'No games added yet.');
        document.getElementById('news-count').textContent = String(news.length);
        document.getElementById('game-count').textContent = String(games.length);
    }

    function renderFeedback() {
        const feedback = loadList(keys.feedback);
        renderRecords(document.getElementById('feedback-list'), feedback, (item, index) => {
            const remove = makeButton('Delete', () => {
                const updated = loadList(keys.feedback);
                updated.splice(index, 1);
                saveList(keys.feedback, updated);
                renderAll();
                showMessage('Feedback deleted.');
            }, 'button-danger');
            return createRecordCard(item.title || 'Feedback', item.text, `${item.name || 'Member'}${item.email ? ` · ${item.email}` : ''} · ${item.date || ''}`, [remove]);
        }, 'No archived feedback.');
    }

    function renderReleaseNotes() {
        const notes = loadReleaseNotes();
        renderRecords(document.getElementById('release-note-list'), notes, (note, index) => {
            const remove = makeButton('Remove', () => {
                const updated = loadReleaseNotes();
                updated.splice(index, 1);
                saveList(keys.releaseNotes, updated);
                renderAll();
                showMessage('Release note removed.');
            }, 'button-danger');
            return createRecordCard(`Version ${note.version}: ${note.title}`, note.text, note.date, [remove]);
        }, 'No release notes published yet.');
    }

    function renderAll() {
        renderMembers();
        renderReview();
        renderNewsAndGames();
        renderFeedback();
        renderReleaseNotes();
        document.getElementById('member-count').textContent = String(readAccounts().length);
        document.getElementById('pending-count').textContent = String(loadList(keys.submissions).length);
    }

    tabs.forEach((tab) => tab.addEventListener('click', () => {
        tabs.forEach((item) => item.classList.toggle('is-active', item === tab));
        panels.forEach((panel) => {
            panel.hidden = panel.id !== `panel-${tab.dataset.panel}`;
        });
        showMessage('');
    }));

    const textForm = document.getElementById('site-text-form');
    let overrides = {};
    try {
        overrides = loadObject(keys.overrides);
    } catch (error) {
        console.error('Could not load saved text changes.', error);
        showMessage('Saved text changes could not be loaded. Restore defaults before editing.');
    }
    formKeys.forEach((key) => {
        textForm.elements.namedItem(key).value = typeof overrides[key] === 'string' ? overrides[key] : originalText[key];
    });

    textForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let current;
        try {
            current = loadObject(keys.overrides);
        } catch (error) {
            console.error('Could not save edited text because the saved settings are invalid.', error);
            showMessage('Saved text data is invalid. Restore defaults before saving edits.');
            return;
        }
        formKeys.forEach((key) => {
            const value = textForm.elements.namedItem(key).value.trim();
            if (value === originalText[key]) {
                delete current[key];
            } else {
                current[key] = value;
            }
        });
        localStorage.setItem(keys.overrides, JSON.stringify(current));
        showMessage('Site text saved. Refresh public pages to see the changes.');
    });

    document.getElementById('reset-site-text').addEventListener('click', () => {
        if (!window.confirm('Restore all edited text to the original wording?')) {
            return;
        }
        localStorage.removeItem(keys.overrides);
        formKeys.forEach((key) => {
            textForm.elements.namedItem(key).value = originalText[key];
        });
        showMessage('Default site text restored.');
    });

    const navigationForm = document.getElementById('navigation-settings-form');
    let hiddenPages = [];
    try {
        const savedNavigation = localStorage.getItem(keys.navigation);
        hiddenPages = savedNavigation ? JSON.parse(savedNavigation) : [];
        if (!Array.isArray(hiddenPages)) {
            throw new Error('Saved navigation settings are not a list.');
        }
    } catch (error) {
        console.error('Could not load saved navigation settings.', error);
        showMessage('Saved navigation settings could not be loaded.');
    }
    navigationForm.querySelectorAll('input[name="page"]').forEach((input) => {
        input.checked = !hiddenPages.includes(input.value);
    });
    navigationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const hidden = Array.from(navigationForm.querySelectorAll('input[name="page"]:not(:checked)')).map((input) => input.value);
        localStorage.setItem(keys.navigation, JSON.stringify(hidden));
        showMessage('Navigation settings saved.');
    });

    document.getElementById('news-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const news = loadList(keys.news);
        news.unshift({ id: crypto.randomUUID(), title: form.elements.title.value.trim(), text: form.elements.text.value.trim(), date: new Date().toLocaleDateString() });
        saveList(keys.news, news);
        form.reset();
        renderAll();
        showMessage('News published.');
    });

    document.getElementById('game-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const games = loadList(keys.games);
        games.unshift({ id: crypto.randomUUID(), title: form.elements.title.value.trim(), description: form.elements.description.value.trim(), href: form.elements.href.value });
        saveList(keys.games, games);
        form.reset();
        renderAll();
        showMessage('Game added to the games page.');
    });

    document.getElementById('release-note-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const notes = loadReleaseNotes();
        notes.unshift({
            id: crypto.randomUUID(),
            version: form.elements.version.value.trim(),
            title: form.elements.title.value.trim(),
            text: form.elements.text.value.trim(),
            date: new Date().toISOString().slice(0, 10)
        });
        saveList(keys.releaseNotes, notes);
        form.reset();
        renderAll();
        showMessage('Version update published on the homepage.');
    });

    document.getElementById('admin-sign-out').addEventListener('click', () => {
        localStorage.removeItem('ourPalestineSession');
        window.location.replace(new URL('login.html', window.location.href).href);
    });

    try {
        renderAll();
    } catch (error) {
        console.error('Could not load admin dashboard data.', error);
        showMessage('Dashboard data could not be loaded. Check browser storage and reload.');
    }
})();
