(() => {
    const sharedScript = document.createElement('script');
    sharedScript.src = new URL('site.js', document.currentScript.src).href;
    sharedScript.onerror = () => console.error(`Could not load shared site behavior: ${sharedScript.src}`);
    document.head.appendChild(sharedScript);
})();
