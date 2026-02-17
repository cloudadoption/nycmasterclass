# Exercise 2: Block Development - Simple Block Variations

**Duration**: 20 minutes

---

## Prerequisites

✅ **Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Code editor open with the repository

**Verify you're on your branch**:
```bash
git branch
# Should show: * jsmith (your name)
```

---

## What You'll Learn

- How the block decoration lifecycle works
- How to implement block variations (eyebrow, stacked)
- How to write mobile-first responsive CSS
- How to maintain proper CSS scoping for blocks

---

## Why This Matters

In Exercise 1, you created content as an author. Now you'll see the developer side - writing the code that transforms authored content into styled, interactive components.

**The Block Contract**: Authors create tables with a specific structure. Developers write JavaScript to decorate (transform) that HTML into the final presentation.

**Block Variations** let you reuse one block with multiple presentations:
- Same Cards block → Different layouts (eyebrow, stacked, grid)
- Authors choose the variation they need
- Developers write the code once

**Real-world scenario**: A Cards block can display speakers (eyebrow style), sponsors (stacked style), or sessions (grid style) - all from one codebase.

---

## How Block Decoration Works

```
1. Author creates table in DA.live
   | Cards (Eyebrow) |
   |-----------------|
   | Speaker         |
   | John Doe        |

2. EDS converts to HTML (before decoration)
   <div class="cards eyebrow">
     <div><div>Speaker</div></div>
     <div><div>John Doe</div></div>
   </div>

3. Your decorate() function transforms it
   - Reads the structure
   - Creates new elements
   - Adds classes
   - Replaces original content

4. Final HTML (after decoration)
   <div class="cards eyebrow">
     <ul>
       <li>
         <div class="cards-card-eyebrow">Speaker</div>
         <div class="cards-card-body">John Doe</div>
       </li>
     </ul>
   </div>

5. CSS styles the decorated HTML
```

**Reference**: [Exploring Blocks](https://www.aem.live/docs/exploring-blocks)

---

## Block Anatomy

Every block has:

```
blocks/
  cards/
    cards.js      - Decoration logic (required)
    cards.css     - Styles (required)
```

**Naming convention**: File names must match block name exactly.

**Variation classes**: Authors add variations in parentheses:
```
| Cards (Eyebrow, Stacked) |
```

Becomes:
```html
<div class="cards eyebrow stacked">
```

Your CSS/JS can then target `.cards.eyebrow` or `.cards.stacked`.

**Reference**: [Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)

---

## Current Cards Block

The repository already has a Cards block. Let's review it:

**File**: `blocks/cards/cards.js`

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    );
  });
  block.replaceChildren(ul);
}
```

**What it does**:
- Creates `<ul>` list
- Each row becomes `<li>` (each card)
- Classifies content as image or body
- Optimizes images
- Replaces original block content

**File**: `blocks/cards/cards.css` - Uses CSS Grid for responsive layout.

---

## Step 1: Create Test Content

**In DA.live**, create page: `/drafts/jsmith/cards-test` (replace `jsmith` with your name)

Add this content:

```
# Cards Block Variations Test

## Default Cards

| Cards |
|-------|
| ![Speaker](https://placehold.co/600x400) |
| John Doe |
| Senior Developer at Adobe |
| ![Speaker](https://placehold.co/600x400) |
| Jane Smith |
| Product Manager at Adobe |

## Eyebrow Variation

| Cards (Eyebrow) |
|-----------------|
| Speaker |
| ![Speaker](https://placehold.co/600x400) |
| John Doe |
| Senior Developer |
| ![Speaker](https://placehold.co/600x400) |
| Jane Smith |
| Product Manager |

## Stacked Variation

| Cards (Stacked) |
|-----------------|
| ![Logo](https://placehold.co/200x200) |
| Adobe |
| Gold Sponsor |
| ![Logo](https://placehold.co/200x200) |
| Microsoft |
| Silver Sponsor |
```

**Save** the page in DA.live.

---

## Step 2: Test Default Cards

**Open**: `http://localhost:3000/drafts/jsmith/cards-test` (replace `jsmith` with your name)

**You should see**:
- Default Cards section showing 2 cards in a grid
- Eyebrow and Stacked sections showing cards (but no special styling yet)

**Why?** The variations (eyebrow, stacked) don't have CSS/JS yet. We'll add that now.

---

## Step 3: Implement Eyebrow Variation

The eyebrow variation adds a label above card content.

**Author structure**:
- Row 1: Eyebrow text (e.g., "Speaker")
- Row 2+: Card content

### Update JavaScript

**File**: `blocks/cards/cards.js`

Replace the entire `decorate` function with:

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const ul = document.createElement('ul');
  const isEyebrow = block.classList.contains('eyebrow');
  let eyebrowText = '';

  // If eyebrow variation, first row contains the eyebrow text
  if (isEyebrow && block.children.length > 0) {
    eyebrowText = block.children[0].textContent.trim();
    block.children[0].remove(); // Remove eyebrow row from content
  }

  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    // Add eyebrow if this variation is enabled
    if (isEyebrow && eyebrowText) {
      const eyebrow = document.createElement('div');
      eyebrow.className = 'cards-card-eyebrow';
      eyebrow.textContent = eyebrowText;
      li.append(eyebrow);
    }

    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else if (!div.classList.contains('cards-card-eyebrow')) {
        div.className = 'cards-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    );
  });
  block.replaceChildren(ul);
}
```

**What changed**:
- Checks for `eyebrow` class on block
- Extracts eyebrow text from first row
- Removes that row from DOM
- Adds eyebrow div to each card

### Add Eyebrow Styles

**File**: `blocks/cards/cards.css`

Add at the end of the file:

```css
/* Eyebrow variation */
.cards.eyebrow .cards-card-eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-color);
  opacity: 0.7;
  margin-bottom: 8px;
}
```

**Key points**:
- `.cards.eyebrow` scopes to eyebrow variation only
- Uses CSS custom property `var(--text-color)` for theming
- All selectors start with `.cards` (proper scoping)

---

## Step 4: Test Eyebrow Variation

**Refresh**: `http://localhost:3000/drafts/jsmith/cards-test` (replace `jsmith` with your name)

**You should see**:
- Eyebrow section now shows "SPEAKER" label above each card
- Label is uppercase, smaller font, slightly transparent

---

## Step 5: Implement Stacked Variation

The stacked variation displays cards in a single column, centered.

### Add Stacked Styles

**File**: `blocks/cards/cards.css`

Add at the end of the file:

```css
/* Stacked variation */
.cards.stacked > ul {
  grid-template-columns: 1fr;
  max-width: 600px;
  margin: 0 auto;
}

.cards.stacked > ul > li {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px;
}

.cards.stacked .cards-card-image {
  margin-bottom: 16px;
}

.cards.stacked > ul > li img {
  width: auto;
  max-width: 200px;
  aspect-ratio: 1 / 1;
}
```

**What this does**:
- Forces single column layout (overrides default grid)
- Centers content horizontally
- Constrains image to 200px square
- Centers text

**No JavaScript needed** - this variation is CSS-only!

---

## Step 6: Test Stacked Variation

**Refresh**: `http://localhost:3000/drafts/jsmith/cards-test` (replace `jsmith` with your name)

**You should see**:
- Stacked section displays as centered single column
- Images are square (200x200)
- Text is centered

---

## Step 7: Commit Your Changes

```bash
# Run linting
npm run lint

# Add changes
git add blocks/cards/

# Commit
git commit -m "feat: add eyebrow and stacked variations to cards block"

# Push
git push origin jsmith
```

Replace `jsmith` with your branch name.

---

## Understanding CSS Scoping

**Critical rule**: All block styles must be scoped to the block.

**Bad (global selector)**:
```css
.card-title {
  font-size: 20px;
}
```

**Why bad?** Could conflict with other blocks using `.card-title`.

**Good (scoped to block)**:
```css
.cards .card-title {
  font-size: 20px;
}
```

**Better (scoped to variation)**:
```css
.cards.eyebrow .card-title {
  font-size: 20px;
}
```

**Reserved classes**: Avoid `.cards-container` and `.cards-wrapper` - these are used by section decoration.

---

## Mobile-First CSS

The cards block uses responsive design without media queries:

```css
grid-template-columns: repeat(auto-fill, minmax(257px, 1fr));
```

**How it works**:
- `auto-fill`: Creates as many columns as fit
- `minmax(257px, 1fr)`: Each column is minimum 257px wide
- Result: Automatically responsive!

**When to use media queries**: Only when you need different layouts at specific breakpoints.

```css
/* Mobile first - default */
.cards > ul {
  gap: 16px;
}

/* Tablet and up */
@media (min-width: 600px) {
  .cards > ul {
    gap: 24px;
  }
}
```

**Standard breakpoints**: 600px (tablet), 900px (small desktop), 1200px (large desktop)

---

## Real-World Applications

**Use Case 1: Event Speakers**
- Use eyebrow variation with "Speaker" label
- Displays speaker bio with consistent labeling

**Use Case 2: Sponsor Logos**
- Use stacked variation for centered logo display
- Perfect for sponsor tiers (Gold, Silver, Bronze)

**Use Case 3: Product Catalog**
- Use default grid for product listings
- Responsive grid adapts to screen size

---

## Key Takeaways

- Block variations use CSS classes (added by authors in parentheses)
- One block codebase → multiple presentations
- JavaScript decorates HTML structure, CSS styles it
- Always scope CSS to the block (`.blockname .selector`)
- Mobile-first CSS uses modern layout (Grid, Flexbox)
- Variations can be CSS-only or require JavaScript

---

## Verification Checklist

- [ ] Created test page with three card variations
- [ ] Implemented eyebrow variation (JavaScript + CSS)
- [ ] Implemented stacked variation (CSS only)
- [ ] Both variations display correctly
- [ ] Understand CSS scoping rules
- [ ] Understand mobile-first responsive design
- [ ] Committed and pushed changes

---

## References

- [Exploring Blocks](https://www.aem.live/docs/exploring-blocks)
- [Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
- [Component Model Definitions](https://www.aem.live/developer/component-model-definitions)

---

## Next Exercise

**Exercise 3**: Dynamic Cards - You'll build a block that fetches data from external sources (Sheets and Workers), learning how to integrate dynamic data into EDS blocks.
