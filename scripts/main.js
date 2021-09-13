import { SPA } from "./spa.js";

const images = [
    "/images/zaproszenia/1.png",
    "/images/zaproszenia/2.png",
    "/images/zaproszenia/3.png",
    "/images/zaproszenia/4.png",
    "/images/zaproszenia/5.png",
];

if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
) {
    runScript();
} else {
    document.addEventListener("DOMContentLoaded", runScript);
}

function runScript() {
    const spa = new SPA();
    spa.addEventListener("load", randomizeImage);
    randomizeImage();
}

function randomizeImage() {
    const container = document.querySelector("#random-invitation");
    let link = container.querySelector(".invitation-link");
    let img = link?.querySelector("img");
    if (!link || !img) {
        link = document.createElement("a");
        link.target = "_blank";
        img = document.createElement("img");
        img.alt = "Losowe zaproszenie";
        link.appendChild(img);
        container.appendChild(link);
    }
    const addr = images[Math.floor(Math.random() * images.length)];
    link.href = addr;
    img.src = addr;
}
