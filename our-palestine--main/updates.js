(() => {
    const storageKey = 'ourPalestineReleaseNotes';
    const defaultUpdates = [
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
    const dialog = document.getElementById('updates-dialog');
    const openButton = document.getElementById('open-updates');
    const closeButton = document.getElementById('close-updates');
    const updatesList = document.getElementById('updates-list');
    const versionSummary = document.getElementById('current-version');

    function readUpdates() {
        const savedUpdates = localStorage.getItem(storageKey);
        if (!savedUpdates) {
            localStorage.setItem(storageKey, JSON.stringify(defaultUpdates));
            return defaultUpdates;
        }

        const updates = JSON.parse(savedUpdates);
        if (!Array.isArray(updates)) {
            throw new Error('Saved release notes have an invalid format.');
        }
        return updates;
    }

    function renderUpdates() {
        const updates = readUpdates();
        const latest = updates[0];
        versionSummary.textContent = latest
            ? `Version ${latest.version} · ${latest.title}`
            : 'No release notes yet';
        updatesList.replaceChildren();

        if (updates.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'updates-empty';
            empty.textContent = 'There are no updates yet.';
            updatesList.appendChild(empty);
            return;
        }

        updates.forEach((update) => {
            const entry = document.createElement('article');
            entry.className = 'update-entry';

            const topLine = document.createElement('div');
            topLine.className = 'update-entry-top';
            const heading = document.createElement('h3');
            heading.textContent = `Version ${update.version}: ${update.title}`;
            topLine.appendChild(heading);

            if (update.date) {
                const date = document.createElement('time');
                date.dateTime = update.date;
                date.textContent = update.date;
                topLine.appendChild(date);
            }

            const description = document.createElement('p');
            description.textContent = update.text;
            entry.append(topLine, description);
            updatesList.appendChild(entry);
        });
    }

    openButton.addEventListener('click', () => {
        try {
            renderUpdates();
            dialog.showModal();
        } catch (error) {
            console.error('Could not open website updates.', error);
            versionSummary.textContent = 'Updates could not be loaded.';
        }
    });

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });

    try {
        renderUpdates();
    } catch (error) {
        console.error('Could not load website updates.', error);
        versionSummary.textContent = 'Updates could not be loaded.';
    }
})();
