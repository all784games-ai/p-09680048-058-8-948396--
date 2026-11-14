(() => {
    const canvas = document.getElementById('platformer-canvas');
    const context = canvas.getContext('2d');
    const status = document.getElementById('game-status');
    const oliveCount = document.getElementById('olive-count');
    const controls = { left: false, right: false };
    const worldWidth = 1600;
    const groundY = 320;
    const platforms = [
        { x: 0, y: groundY, width: 390, height: 40 },
        { x: 470, y: groundY, width: 300, height: 40 },
        { x: 860, y: groundY, width: 310, height: 40 },
        { x: 1270, y: groundY, width: 330, height: 40 },
        { x: 205, y: 250, width: 110, height: 16 },
        { x: 390, y: 205, width: 115, height: 16 },
        { x: 610, y: 250, width: 115, height: 16 },
        { x: 770, y: 205, width: 120, height: 16 },
        { x: 1030, y: 240, width: 130, height: 16 },
        { x: 1235, y: 190, width: 120, height: 16 }
    ];
    const oliveSpots = [
        { x: 250, y: 220 },
        { x: 430, y: 175 },
        { x: 660, y: 220 },
        { x: 1080, y: 210 },
        { x: 1280, y: 160 }
    ];
    const olives = oliveSpots.map((olive) => ({ ...olive, collected: false }));
    const player = { x: 48, y: groundY - 38, width: 26, height: 38, velocityX: 0, velocityY: 0, grounded: false };
    const keys = new Set();
    let cameraX = 0;
    let lastFrame = 0;
    let finished = false;
    let frameId;

    const statusText = {
        ready: { en: 'Ready when you are.', ar: 'اللعبة جاهزة!' },
        playing: { en: 'Keep going!', ar: 'تابع اللعب!' },
        won: { en: 'You made it! Demo complete.', ar: 'لقد وصلت! انتهى العرض التجريبي.' }
    };

    function updateStatus(state) {
        status.textContent = statusText[state][document.documentElement.lang === 'ar' ? 'ar' : 'en'];
    }

    function updateOliveCount() {
        const total = olives.length;
        const collected = olives.filter((olive) => olive.collected).length;
        oliveCount.textContent = `${collected} / ${total}`;
    }

    function resetGame() {
        player.x = 48;
        player.y = groundY - player.height;
        player.velocityX = 0;
        player.velocityY = 0;
        player.grounded = false;
        cameraX = 0;
        finished = false;
        controls.left = false;
        controls.right = false;
        keys.clear();
        olives.forEach((olive) => { olive.collected = false; });
        updateOliveCount();
        updateStatus('ready');
    }

    function overlaps(a, b) {
        return a.x < b.x + b.width && a.x + a.width > b.x
            && a.y < b.y + b.height && a.y + a.height > b.y;
    }

    function movePlayer(delta) {
        const movingLeft = keys.has('ArrowLeft') || keys.has('KeyA') || controls.left;
        const movingRight = keys.has('ArrowRight') || keys.has('KeyD') || controls.right;
        player.velocityX = (Number(movingRight) - Number(movingLeft)) * 230;
        player.x = Math.max(0, Math.min(worldWidth - player.width, player.x + player.velocityX * delta));

        const previousBottom = player.y + player.height;
        player.velocityY = Math.min(player.velocityY + 1500 * delta, 900);
        player.y += player.velocityY * delta;
        player.grounded = false;

        platforms.forEach((platform) => {
            const overlapsHorizontally = player.x + player.width > platform.x && player.x < platform.x + platform.width;
            const currentBottom = player.y + player.height;
            if (player.velocityY >= 0 && overlapsHorizontally && previousBottom <= platform.y && currentBottom >= platform.y) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        });

        if (player.y > canvas.height + 80) {
            player.x = Math.max(0, player.x - 180);
            player.y = groundY - player.height;
            player.velocityY = 0;
            updateStatus('playing');
        }

        olives.forEach((olive) => {
            if (!olive.collected && overlaps(player, { x: olive.x - 9, y: olive.y - 9, width: 18, height: 18 })) {
                olive.collected = true;
                updateOliveCount();
            }
        });

        if (!finished && player.x + player.width >= 1515) {
            finished = true;
            updateStatus('won');
        } else if (!finished && player.x > 50) {
            updateStatus('playing');
        }
    }

    function drawBackground() {
        context.fillStyle = '#c8eced';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#fffefa';
        [[90, 68], [305, 102], [580, 58], [720, 100]].forEach(([x, y]) => {
            const cloudX = (x - cameraX * 0.18 + canvas.width) % canvas.width;
            context.beginPath();
            context.arc(cloudX, y, 22, 0, Math.PI * 2);
            context.arc(cloudX + 23, y + 6, 18, 0, Math.PI * 2);
            context.arc(cloudX - 20, y + 8, 15, 0, Math.PI * 2);
            context.fill();
        });

        context.fillStyle = '#9bca9a';
        context.beginPath();
        context.moveTo(0, 320);
        for (let x = 0; x <= canvas.width; x += 80) {
            context.lineTo(x, 245 + Math.sin((x + cameraX * 0.25) / 110) * 28);
        }
        context.lineTo(canvas.width, 360);
        context.lineTo(0, 360);
        context.fill();
    }

    function drawOlive(olive) {
        if (olive.collected) return;
        const x = olive.x - cameraX;
        context.fillStyle = '#416b39';
        context.beginPath();
        context.ellipse(x, olive.y, 7, 10, -0.5, 0, Math.PI * 2);
        context.fill();
        context.fillStyle = '#d7a348';
        context.beginPath();
        context.arc(x + 2, olive.y - 3, 2, 0, Math.PI * 2);
        context.fill();
    }

    function drawWorld() {
        platforms.forEach((platform) => {
            const x = platform.x - cameraX;
            if (x + platform.width < 0 || x > canvas.width) return;
            context.fillStyle = platform.y === groundY ? '#986c47' : '#9a7049';
            context.fillRect(x, platform.y, platform.width, platform.height);
            context.fillStyle = '#43824f';
            context.fillRect(x, platform.y, platform.width, 7);
        });

        olives.forEach(drawOlive);

        const flagX = 1530 - cameraX;
        context.fillStyle = '#6f5438';
        context.fillRect(flagX, 242, 5, 78);
        context.fillStyle = '#d7a348';
        context.beginPath();
        context.moveTo(flagX + 5, 244);
        context.lineTo(flagX + 37, 256);
        context.lineTo(flagX + 5, 269);
        context.closePath();
        context.fill();

        const x = player.x - cameraX;
        context.fillStyle = '#17764b';
        context.fillRect(x + 3, player.y + 10, 20, 23);
        context.fillStyle = '#d7a348';
        context.fillRect(x, player.y + 5, 26, 8);
        context.fillStyle = '#f2c99d';
        context.fillRect(x + 6, player.y, 14, 14);
        context.fillStyle = '#1d3029';
        context.fillRect(x + 16, player.y + 5, 3, 3);
        context.fillStyle = '#725238';
        context.fillRect(x + 3, player.y + 32, 8, 6);
        context.fillRect(x + 16, player.y + 32, 8, 6);
    }

    function render() {
        cameraX = Math.max(0, Math.min(worldWidth - canvas.width, player.x - canvas.width * 0.38));
        drawBackground();
        drawWorld();
    }

    function frame(timestamp) {
        const delta = Math.min((timestamp - (lastFrame || timestamp)) / 1000, 0.032);
        lastFrame = timestamp;
        if (!finished) movePlayer(delta);
        render();
        frameId = window.requestAnimationFrame(frame);
    }

    function onKeyDown(event) {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' '].includes(event.key)) event.preventDefault();
        keys.add(event.code);
        if (['Space', 'ArrowUp', 'KeyW'].includes(event.code) && player.grounded && !finished) {
            player.velocityY = -560;
            player.grounded = false;
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', (event) => keys.delete(event.code));
    window.addEventListener('blur', () => {
        keys.clear();
        controls.left = false;
        controls.right = false;
    });

    document.querySelectorAll('[data-control]').forEach((button) => {
        const control = button.dataset.control;
        const release = () => {
            if (control === 'jump') return;
            controls[control] = false;
        };
        button.addEventListener('pointerdown', (event) => {
            event.preventDefault();
            if (control === 'jump') {
                if (player.grounded && !finished) {
                    player.velocityY = -560;
                    player.grounded = false;
                }
            } else {
                controls[control] = true;
            }
            button.setPointerCapture(event.pointerId);
        });
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
        button.addEventListener('lostpointercapture', release);
    });

    document.getElementById('restart-game').addEventListener('click', resetGame);
    document.getElementById('lang-toggle').addEventListener('click', () => {
        window.setTimeout(() => {
            if (!finished) updateStatus(player.x > 50 ? 'playing' : 'ready');
            else updateStatus('won');
        }, 0);
    });

    resetGame();
    frameId = window.requestAnimationFrame(frame);
    window.addEventListener('pagehide', () => window.cancelAnimationFrame(frameId), { once: true });
})();
