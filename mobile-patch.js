const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// Normalize newlines
css = css.replace(/\r\n/g, '\n');

const originalMediaQuery = `@media (max-width: 768px) {
  .clients-marquee {
    gap: 0.75rem;
    padding: 0.5rem 0 1rem;
  }
  
  .clients-track {
    gap: 0.75rem;
  }
  
  .clients-track:not([dir="rtl"]) {
    padding-right: 0.75rem;
  }
  
  .clients-track[dir="rtl"] {
    padding-left: 0.75rem;
  }`;

const newMediaQuery = `@media (max-width: 768px) {
  .clients-marquee {
    gap: 0.75rem;
    padding: 0.5rem 0 1rem;
    -webkit-mask-image: none;
    mask-image: none;
  }
  
  .clients-track {
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

if (css.includes(originalMediaQuery)) {
  css = css.replace(originalMediaQuery, newMediaQuery);
  fs.writeFileSync('style.css', css);
  console.log('Mobile patch successfully applied.');
} else {
  console.error('Could not find original media query block in style.css');
}

// 2. Bump cache buster in index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('href="style.min.css?v=2"', 'href="style.min.css?v=4"');
fs.writeFileSync('index.html', html);
console.log('Cache buster bumped.');
