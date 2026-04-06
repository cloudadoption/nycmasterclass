import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Converts a speaker name to a URL-safe slug for anchor linking.
 * @param {string} name
 * @returns {string}
 */
function toSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Loads and decorates the speakers block.
 * Content model: each row = one speaker
 *   Column 1: headshot image
 *   Column 2: name (h3), title/company (p), bio (p, optional)
 * @param {Element} block The speakers block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [imageCol, contentCol] = row.children;

    if (imageCol) imageCol.className = 'speakers-image';
    if (contentCol) contentCol.className = 'speakers-content';

    // Optimize the speaker headshot
    const img = imageCol && imageCol.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '300' }]);
      img.closest('picture').replaceWith(optimized);
    }

    // Mark the title (first <p> in content col) with a class for styling
    if (contentCol) {
      const heading = contentCol.querySelector('h3');
      const paras = contentCol.querySelectorAll('p');
      if (heading) {
        heading.className = 'speakers-name';
        heading.id = toSlug(heading.textContent);
      }
      if (paras[0]) paras[0].className = 'speakers-title';
      if (paras[1]) paras[1].className = 'speakers-bio';
    }
  });
}
