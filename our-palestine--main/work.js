(() => {
    const sharedScript = document.createElement('script');
    sharedScript.src = new URL('site.js', document.currentScript.src).href;
    sharedScript.onerror = () => console.error(`Could not load shared site behavior: ${sharedScript.src}`);
    document.head.appendChild(sharedScript);

    const storageKey = 'ourPalestineWorkListings';
    const sessionKey = 'ourPalestineSession';
    const form = document.getElementById('job-form');
    const search = document.getElementById('job-search');
    const typeFilter = document.getElementById('type-filter');
    const jobList = document.getElementById('job-list');
    const count = document.getElementById('job-count');
    const message = document.getElementById('job-message');
    let listings = [];
    let userId = '';
    let language = new URLSearchParams(window.location.search).get('lang') === 'ar' ? 'ar' : 'en';

    const words = {
        en: {
            singular: 'opportunity', plural: 'opportunities', noJobs: 'No jobs match your search. Try another keyword or type.',
            noListings: 'No opportunities posted yet. Be the first to share one.',
            postedBy: 'Posted by', posted: 'Posted', compensation: 'Compensation', apply: 'Email to apply', remove: 'Remove your post',
            saved: 'Your opportunity has been posted.', removed: 'Your post was removed.',
            saveError: 'The opportunity could not be saved. Check browser storage and try again.',
            loadError: 'Job listings could not be loaded. Check browser storage and reload this page.',
            removeError: 'Your post could not be removed. Check browser storage and try again.'
        },
        ar: {
            singular: 'فرصة', plural: 'فرص', noJobs: 'لا توجد وظائف تطابق بحثك. جرّب كلمة أو نوعًا آخر.',
            noListings: 'لا توجد فرص منشورة بعد. كن أول من يشارك فرصة.',
            postedBy: 'نشر بواسطة', posted: 'تاريخ النشر', compensation: 'التعويض', apply: 'راسل للتقديم', remove: 'حذف إعلانك',
            saved: 'تم نشر فرصتك.', removed: 'تم حذف إعلانك.',
            saveError: 'تعذر حفظ الفرصة. تحقق من مساحة التخزين في المتصفح وحاول مرة أخرى.',
            loadError: 'تعذر تحميل الوظائف. تحقق من مساحة التخزين وأعد تحميل الصفحة.',
            removeError: 'تعذر حذف إعلانك. تحقق من مساحة التخزين وحاول مرة أخرى.'
        }
    };

    function showMessage(text, isError = false) {
        message.textContent = text;
        message.classList.toggle('is-error', isError);
    }

    function escapeSearch(value) {
        return value.toLocaleLowerCase(language);
    }

    function render() {
        const query = escapeSearch(search.value.trim());
        const selectedType = typeFilter.value;
        const matching = listings.filter((listing) => {
            const text = [listing.title, listing.company, listing.location, listing.description, listing.type, listing.compensation].join(' ');
            return (selectedType === 'all' || listing.type === selectedType) && escapeSearch(text).includes(query);
        }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        count.textContent = `${matching.length} ${matching.length === 1 ? words[language].singular : words[language].plural}`;
        jobList.replaceChildren();
        if (matching.length === 0) {
            const empty = document.createElement('p');
            empty.className = 'job-empty';
            empty.textContent = listings.length === 0 ? words[language].noListings : words[language].noJobs;
            jobList.appendChild(empty);
            return;
        }

        matching.forEach((listing) => {
            const card = document.createElement('article');
            card.className = 'job-card';
            const tags = document.createElement('div');
            tags.className = 'job-tags';
            const type = document.createElement('span');
            type.className = 'job-tag';
            type.textContent = listing.type;
            tags.appendChild(type);
            if (listing.location) {
                const location = document.createElement('span');
                location.className = 'job-tag';
                location.textContent = listing.location;
                tags.appendChild(location);
            }
            const title = document.createElement('h2');
            title.textContent = listing.title;
            const company = document.createElement('p');
            company.className = 'job-company';
            company.textContent = listing.company;
            const description = document.createElement('p');
            description.className = 'job-description';
            description.textContent = listing.description;
            const posted = document.createElement('p');
            posted.className = 'job-meta';
            const date = new Date(listing.createdAt);
            posted.textContent = `${words[language].postedBy} ${listing.poster} · ${words[language].posted} ${Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(language)}`;
            card.append(tags, title, company, description, posted);
            if (listing.compensation) {
                const compensation = document.createElement('p');
                compensation.className = 'job-meta';
                compensation.textContent = `${words[language].compensation}: ${listing.compensation}`;
                card.appendChild(compensation);
            }
            const contact = document.createElement('a');
            contact.className = 'job-contact';
            contact.href = `mailto:${encodeURIComponent(listing.email)}?subject=${encodeURIComponent(`Application: ${listing.title}`)}`;
            contact.textContent = words[language].apply;
            card.appendChild(contact);
            if (listing.ownerId === userId) {
                const remove = document.createElement('button');
                remove.type = 'button';
                remove.className = 'job-delete';
                remove.textContent = words[language].remove;
                remove.addEventListener('click', () => removeListing(listing.id));
                card.appendChild(remove);
            }
            jobList.appendChild(card);
        });
    }

    function readListings() {
        const saved = localStorage.getItem(storageKey);
        if (saved === null) return [];
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) {
            throw new Error('Saved job listings have an invalid format.');
        }
        return parsed;
    }

    function saveListings() {
        localStorage.setItem(storageKey, JSON.stringify(listings));
    }

    function removeListing(id) {
        const listing = listings.find((item) => item.id === id);
        if (!listing || listing.ownerId !== userId) return;
        const updated = listings.filter((item) => item.id !== id);
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
            listings = updated;
            render();
            showMessage(words[language].removed);
        } catch (error) {
            console.error('Could not remove job listing.', error);
            showMessage(words[language].removeError, true);
        }
    }

    search.addEventListener('input', render);
    typeFilter.addEventListener('change', render);
    document.addEventListener('site-language-change', (event) => {
        language = event.detail.lang;
        render();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const listing = {
            id: crypto.randomUUID(),
            ownerId: userId,
            poster: JSON.parse(localStorage.getItem(sessionKey)).name,
            title: String(data.get('title')).trim(),
            company: String(data.get('company')).trim(),
            type: String(data.get('type')),
            location: String(data.get('location')).trim(),
            description: String(data.get('description')).trim(),
            compensation: String(data.get('compensation')).trim(),
            email: String(data.get('email')).trim(),
            createdAt: new Date().toISOString()
        };
        const updated = [listing, ...listings];
        try {
            localStorage.setItem(storageKey, JSON.stringify(updated));
            listings = updated;
            form.reset();
            render();
            showMessage(words[language].saved);
        } catch (error) {
            console.error('Could not save job listing.', error);
            showMessage(words[language].saveError, true);
        }
    });

    try {
        const session = JSON.parse(localStorage.getItem(sessionKey) || 'null');
        if (!session || typeof session.name !== 'string') throw new Error('Sign-in session is unavailable.');
        userId = session.email ? `member:${session.email}` : `guest:${session.name}`;
        listings = readListings();
        render();
    } catch (error) {
        console.error('Could not load job board.', error);
        showMessage(words[language].loadError, true);
    }
})();
