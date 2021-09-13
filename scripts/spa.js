export class SPA {
    pages = {};
    events = { preload: [], load: [] };
    constructor(appClass = "app", linkClass = "nav-link") {
        this.appClass = appClass;
        this.linkClass = linkClass;
        this.parser = new DOMParser();
        this.init();
        this.pages = {};
        this.events = { preload: [], load: [] };
    }
    init() {
        this.app = document.querySelector(`.${this.appClass}`);
        const links = document.querySelectorAll(`.${this.linkClass}`);
        for (const link of links) {
            link.addEventListener("mouseover", (event) => this.preload(event));
            link.addEventListener("click", (event) => this.load(event));
        }
    }
    /**
     * Add a callback function for SPA events
     * @param {"load"|"preload"} type
     * @param {function} fn
     */
    addEventListener(type, fn) {
        switch (type) {
            case "preload":
                this.events.preload.push(fn);
                break;
            case "load":
                this.events.load.push(fn);
                break;
            default:
                throw new Error(
                    `Unknown event type: ${type}. Use "preload" or "load"`
                );
        }
    }
    async preloadEvent(event) {
        const url = event.target.getAttribute("href");
        if (url !== document.location.pathname) {
            await this.preload();
        }
        for (const fn of this.events.preload) {
            fn(url);
        }
    }
    async preload(url) {
        const result = await fetch(url);
        const html = await result.text();
        const preloadedDocument = this.parser.parseFromString(
            html,
            "text/html"
        );
        const app = preloadedDocument.querySelector(`.${this.appClass}`);
        this.pages[url] = app;
        return app;
    }
    async load(event) {
        event.preventDefault();
        const url = event.target.getAttribute("href");
        const name = event.target.innerText;
        this.app.innerHTML =
            this?.pages[url]?.innerHTML ?? (await this.preload(url))?.innerHTML;
        history.pushState({ page: name }, name, url);
        for (const fn of this.events.load) {
            fn(url);
        }
    }
}
