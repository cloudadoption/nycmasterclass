/*
 * Copyright 2024 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { moveInstrumentation } from './ue-utils.js';

const setupObservers = () => {
  const mutatingBlocks = document.querySelectorAll('div.cards');
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target.tagName === 'DIV') {
        const type = mutation.target.classList.contains('cards-card-image')
          ? 'cards-image'
          : mutation.target.attributes['data-aue-component']?.value;

        switch (type) {
          case 'cards':
            if (mutation.addedNodes.length === 1 && mutation.addedNodes[0].tagName === 'UL') {
              const ulEl = mutation.addedNodes[0];
              const removedDivEl = [...mutation.removedNodes].filter((node) => node.tagName === 'DIV');
              removedDivEl.forEach((div, index) => {
                if (index < ulEl.children.length) {
                  moveInstrumentation(div, ulEl.children[index]);
                }
              });
            }
            break;
          case 'cards-image':
            if (mutation.target.classList.contains('cards-card-image')) {
              const addedPictureEl = [...mutation.addedNodes].filter((node) => node.tagName === 'PICTURE');
              const removedPictureEl = [...mutation.removedNodes].filter((node) => node.tagName === 'PICTURE');
              if (addedPictureEl.length === 1 && removedPictureEl.length === 1) {
                const oldImgEl = removedPictureEl[0].querySelector('img');
                const newImgEl = addedPictureEl[0].querySelector('img');
                if (oldImgEl && newImgEl) {
                  moveInstrumentation(oldImgEl, newImgEl);
                }
              }
            }
            break;
          default:
            break;
        }
      }
    });
  });

  mutatingBlocks.forEach((block) => {
    observer.observe(block, { childList: true, subtree: true });
  });
};

const setupUEEventHandlers = () => {
  document.body.addEventListener('aue:content-patch', ({ detail: { patch, request } }) => {
    let element = document.querySelector(`[data-aue-resource="${request.target.resource}"]`);
    if (element && element.getAttribute('data-aue-prop') !== patch.name) {
      element = element.querySelector(`[data-aue-prop='${patch.name}']`);
    }
    if (element?.getAttribute('data-aue-type') !== 'media') return;

    const picture = element.tagName === 'IMG' ? element.closest('picture') : element;
    picture?.querySelectorAll('source').forEach((source) => source.remove());
    picture?.querySelector('img')?.removeAttribute('srcset');
  });

  document.body.addEventListener('aue:ui-select', (event) => {
    const { detail } = event;
    const resource = detail?.resource;

    if (!resource) return;

    const element = document.querySelector(`[data-aue-resource="${resource}"]`);
    if (!element) return;

    const blockEl = element.parentElement?.closest('.block[data-aue-resource]')
      || element?.closest('.block[data-aue-resource]');
    if (!blockEl) return;

    const block = blockEl.getAttribute('data-aue-component');

    switch (block) {
      case 'tabs':
        if (element === blockEl) return;
        blockEl.querySelectorAll('[role=tabpanel]').forEach((panel) => {
          panel.setAttribute('aria-hidden', true);
        });
        element.setAttribute('aria-hidden', false);
        blockEl.querySelector('.tabs-list').querySelectorAll('button').forEach((btn) => {
          btn.setAttribute('aria-selected', false);
        });
        blockEl.querySelector(`[aria-controls=${element?.id}]`)?.setAttribute('aria-selected', true);
        break;
      default:
        break;
    }
  });
};

export default () => {
  setupObservers();
  setupUEEventHandlers();
};
