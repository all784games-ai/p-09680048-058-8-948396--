(() => {
    function renderCommunityGames() {
        const grid = document.getElementById('game-choice-grid');
        if (!grid) {
            return;
        }

        const savedGames = localStorage.getItem('ourPalestineGames');
        if (!savedGames) {
            return;
        }

        try {
            const games = JSON.parse(savedGames);
            if (!Array.isArray(games)) {
                throw new Error('Saved community games have an invalid format.');
            }

            const permittedPages = new Set(['quiz.html', 'platformer.html', 'game.html']);
            games.forEach((game) => {
                const card = document.createElement('a');
                const gamePage = permittedPages.has(game.href) ? game.href : 'game.html';
                card.className = 'card game-choice';
                card.href = new URL(gamePage, window.location.href).href;
                const icon = document.createElement('span');
                icon.className = 'game-choice-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.textContent = '★';
                const heading = document.createElement('h2');
                heading.textContent = game.title;
                const description = document.createElement('p');
                description.textContent = game.description;
                const action = document.createElement('span');
                action.className = 'game-card-cta';
                action.textContent = 'Play game →';
                card.append(icon, heading, description, action);
                grid.appendChild(card);
            });
        } catch (error) {
            console.error('Could not render published community games.', error);
        }
    }

    const sharedScript = document.createElement('script');
    sharedScript.src = new URL('site.js', document.currentScript.src).href;
    sharedScript.onerror = () => console.error(`Could not load shared site behavior: ${sharedScript.src}`);
    document.head.appendChild(sharedScript);
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderCommunityGames, { once: true });
    } else {
        renderCommunityGames();
    }
})();
