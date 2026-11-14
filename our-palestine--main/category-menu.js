(() => {
    const menus = {
        travel: {
            title: 'categoryMenu.travel.title',
            pageTitle: 'categoryMenu.travel.pageTitle',
            description: 'categoryMenu.travel.description',
            options: [
                ['categoryMenu.travel.map.title', 'categoryMenu.travel.map.description', 'map.html'],
                ['categoryMenu.travel.about.title', 'categoryMenu.travel.about.description', 'my-palistain.html#about-section'],
                ['categoryMenu.travel.community.title', 'categoryMenu.travel.community.description', 'my-palistain.html#contact-section']
            ]
        },
        community: {
            title: 'categoryMenu.community.title',
            pageTitle: 'categoryMenu.community.pageTitle',
            description: 'categoryMenu.community.description',
            options: [
                ['categoryMenu.community.contact.title', 'categoryMenu.community.contact.description', 'my-palistain.html#contact-section'],
                ['categoryMenu.community.market.title', 'categoryMenu.community.market.description', 'market.html'],
                ['categoryMenu.community.services.title', 'categoryMenu.community.services.description', 'services.html']
            ]
        },
        culture: {
            title: 'categoryMenu.culture.title',
            pageTitle: 'categoryMenu.culture.pageTitle',
            description: 'categoryMenu.culture.description',
            options: [
                ['categoryMenu.culture.about.title', 'categoryMenu.culture.about.description', 'my-palistain.html#about-section'],
                ['categoryMenu.culture.games.title', 'categoryMenu.culture.games.description', 'game.html'],
                ['categoryMenu.culture.quiz.title', 'categoryMenu.culture.quiz.description', 'quiz.html']
            ]
        }
    };

    const params = new URLSearchParams(window.location.search);
    const selectedMenu = menus[params.get('menu')] || menus.travel;
    const title = document.getElementById('category-menu-title');
    const description = document.getElementById('category-menu-description');
    const options = document.getElementById('category-menu-options');

    title.dataset.i18n = selectedMenu.title;
    description.dataset.i18n = selectedMenu.description;
    document.querySelector('title').dataset.i18n = selectedMenu.pageTitle;

    selectedMenu.options.forEach(([titleKey, descriptionKey, href]) => {
        const card = document.createElement('a');
        card.className = 'card category-menu-card';
        card.href = href;

        const heading = document.createElement('h2');
        heading.dataset.i18n = titleKey;
        const summary = document.createElement('p');
        summary.dataset.i18n = descriptionKey;
        const action = document.createElement('span');
        action.dataset.i18n = 'services.explore';

        card.append(heading, summary, action);
        options.appendChild(card);
    });

    const sharedScript = document.createElement('script');
    sharedScript.src = new URL('site.js', document.currentScript.src).href;
    sharedScript.onerror = () => console.error(`Could not load shared site behavior: ${sharedScript.src}`);
    document.head.appendChild(sharedScript);
})();
