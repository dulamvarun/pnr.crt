const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

css = css.replace(/\r\n/g, '\n');

const toReplace = `  .clients-track {
    gap: 0.75rem;
    display: inline-flex !important;
    min-width: max-content;
    flex-shrink: 0;
  }
  
  .clients-track:not([dir="rtl"]) {
    padding-right: 0.75rem;
  }
  
  .clients-track[dir="rtl"] {
    direction: ltr !important;
    padding-right: 0.75rem;
    padding-left: 0 !important;
  }`;

const target = `  .clients-track {
    gap: 0.75rem;
    display: flex !important;
    width: max-content;
    flex-shrink: 0;
  }
  
  .clients-track.track-left {
    padding-right: 0.75rem;
    animation-name: mobileScrollLeft !important;
  }
  
  .clients-track.track-right {
    direction: ltr !important;
    padding-right: 0.75rem;
    padding-left: 0 !important;
    animation-name: mobileScrollRight !important;
  }`;

if (css.includes(toReplace)) {
  css = css.replace(toReplace, target);
  console.log("Replaced media query.");
} else {
  console.log("Could not find media query replacement chunk.");
}

const keyframes = `

/* Bypassing iOS Safari Flex width max-content buggy computation */
@media (max-width: 768px) {
  @keyframes mobileScrollLeft {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(-1220px, 0, 0); }
  }

  @keyframes mobileScrollRight {
    0% { transform: translate3d(-1342px, 0, 0); }
    100% { transform: translate3d(0, 0, 0); }
  }
}`;

if (!css.includes("mobileScrollLeft")) {
  css += keyframes;
  console.log("Appended hardcoded pixel keyframes.");
}

fs.writeFileSync('style.css', css);

let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('style.min.css?v=4', 'style.min.css?v=5');
fs.writeFileSync('index.html', html);
console.log("Bumped cache to v5");
