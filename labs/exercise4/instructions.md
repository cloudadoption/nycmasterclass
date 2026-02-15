# Exercise 4: Page List Block with Query Index

**Duration**: 20 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Exercises 1-3 completed
- **query-index.json available** (instructor will have published main branch content)

**Verify query-index.json is available**:

Open in browser:
```
http://localhost:3000/query-index.json
```

**You should see**: JSON with all published sessions and labs (15+ pages) including their metadata (title, description, category, tags, session-time, etc.)

**If you see 404**: Run `git pull origin main` to get the latest published content, then restart your dev server (`aem up`).

---

## What You'll Learn

- How the query index works in EDS
- How to configure custom metadata indexing with `helix-query.yaml`
- How to build a block that fetches and displays pages dynamically
- How to filter and sort pages using metadata

---

## Why This Matters

The query index combined with **auto-blocking** solves a common problem: **How do you build dynamic page listings without authors creating blocks?**

**The pattern**:
- Authors organize pages naturally in folders (`/developers/`, `/blog/`, `/events/`)
- Authors set page metadata (template, category)
- Developer writes auto-blocking logic in `scripts.js`
- Block automatically appears on pages based on rules
- Block shows relevant content based on page context

**Example**: A page at `/developers/getting-started` automatically shows latest articles from `/developers/**` - no manual block creation needed.

**The contract**:
- **Authors**: Organize pages logically, set metadata
- **Developers**: Write auto-blocking rules, handle filtering

**Common use cases**:
- Blog category pages automatically showing articles in that category
- Landing pages automatically showing featured content
- Section pages showing latest content from that section

---

## How Query Index Works

```
1. Author publishes page to .aem.live
2. EDS extracts metadata using CSS selectors
3. Data stored in query-index.json
4. Your block fetches and renders the data
```

**Default indexed fields**: path, title, description, image, lastModified

**Custom fields**: Configure in `helix-query.yaml` using CSS selectors

**Important**: Only published pages (`.aem.live`) are indexed, not preview (`.aem.page`)

**Reference**: [Indexing Reference](https://www.aem.live/docs/indexing-reference)

---

## Understanding Query Index Structure

The query index has the same JSON structure as Sheets (from Exercise 3):

```json
{
  "total": 10,
  "offset": 0,
  "limit": 10,
  "data": [
    {
      "path": "/events/session-1",
      "title": "Building Blocks Workshop",
      "description": "Learn to build custom blocks",
      "tags": "development,blocks",
      "category": "workshop",
      "publishedDate": "1739836800",
      "lastModified": "1739836800"
    }
  ]
}
```

**Key insight**: Same structure as Sheets means you can reuse the same block patterns!

---

## Understanding the Available Data

The query-index.json already contains all published sessions and labs from the NYC Masterclass site.

**Inspect the data** by opening in browser:
```
http://localhost:3000/query-index.json
```

**You'll see** 15+ pages including:
- `/sessions/what-is-edge-delivery`
- `/sessions/architecture-deep-dive`
- `/sessions/authoring-approaches`
- `/labs/authoring-first-page`
- `/labs/block-development`
- And more...

**Metadata included**:
- `path`, `title`, `description`
- `category` (technical, authoring, development, configuration)
- `tags` (authoring, blocks, development, etc.)
- `session-time` or `lab-time`
- `session-level` or `difficulty`
- `lastModified`, `published-date`

**Browse the full index** using the Index Admin Tool:
1. Go to https://tools.aem.live/tools/index-admin
2. Enter: `cloudadoption/nycmasterclass/main`
3. View all indexed pages and their metadata fields

**Key principle**: Only **published** pages (on `.aem.live`) appear in query-index.json. Preview-only pages won't show up.

---

## Step 1: Create Block Files

In your code editor, create:

```
blocks/
  page-list/
    page-list.js
    page-list.css
```

---

## Step 2: Implement Block JavaScript

**File**: `blocks/page-list/page-list.js`

Copy this code:

```javascript
import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Displays pages from query index as filterable cards
 *
 * Auto-blocking will inject this block with configuration.
 * Config is passed via data attributes or block content.
 */
export default async function decorate(block) {
  // Extract configuration from block content
  const rows = [...block.children];
  const pathFilter = rows[0]?.textContent.trim() || '';
  const secondRow = rows[1]?.textContent.trim() || '';
  const thirdRow = rows[2]?.textContent.trim() || '';
  
  // Determine if second row is category or limit
  const isNumeric = !Number.isNaN(parseInt(secondRow, 10));
  const categoryFilter = !isNumeric ? secondRow : '';
  const limit = parseInt(isNumeric ? secondRow : thirdRow || '10', 10);

  block.innerHTML = '<p>Loading pages...</p>';

  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const json = await response.json();
    let pages = json.data;

    // Filter by path (e.g., show only /sessions/** pages)
    if (pathFilter) {
      pages = pages.filter((page) => page.path.startsWith(pathFilter));
    }

    // Filter by category
    if (categoryFilter) {
      pages = pages.filter(
        (page) => page.category && page.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Sort by date (newest first)
    pages.sort((a, b) => {
      const dateA = a.publishedDate ? parseInt(a.publishedDate, 10) : 0;
      const dateB = b.publishedDate ? parseInt(b.publishedDate, 10) : 0;
      return dateB - dateA;
    });

    // Apply limit
    pages = pages.slice(0, limit);

    block.innerHTML = '';

    if (pages.length === 0) {
      block.innerHTML = '<p>No pages found.</p>';
      return;
    }

    // Build cards
    const ul = document.createElement('ul');
    ul.className = 'page-list-cards';

    pages.forEach((page) => {
      const li = document.createElement('li');
      li.className = 'page-card';

      let imageHTML = '';
      if (page.image) {
        const pic = createOptimizedPicture(page.image, page.title, false, [{ width: '400' }]);
        imageHTML = `<div class="page-card-image">${pic.outerHTML}</div>`;
      }

      let tagsHTML = '';
      if (page.tags) {
        const tagList = page.tags
          .split(',')
          .map((t) => `<span class="tag">${t.trim()}</span>`)
          .join('');
        tagsHTML = `<div class="page-card-tags">${tagList}</div>`;
      }

      let metaHTML = '';
      // For sessions: show speaker and time
      if (page['speaker-name'] && page['session-time']) {
        metaHTML = `<p class="page-card-meta">${page['speaker-name']} • ${page['session-time']}</p>`;
      }
      // For labs: show instructor and time
      if (page['instructor-name'] && page['lab-time']) {
        metaHTML = `<p class="page-card-meta">${page['instructor-name']} • ${page['lab-time']}</p>`;
      }

      li.innerHTML = `
        ${imageHTML}
        <div class="page-card-body">
          <h3><a href="${page.path}">${page.title}</a></h3>
          ${page.description ? `<p class="page-card-description">${page.description}</p>` : ''}
          ${tagsHTML}
          ${metaHTML}
        </div>
      `;

      ul.append(li);
    });

    block.append(ul);
  } catch (error) {
    block.innerHTML = `<p class="error">Error loading pages: ${error.message}</p>`;
    console.error('Page List error:', error);
  }
}
```

**What this does**:
- Extracts configuration from authored block content (path, category, limit)
- Fetches `/query-index.json` from the server
- Filters by path (e.g., only `/sessions/**` pages)
- Optionally filters by category
- Sorts by published date (newest first)
- Limits results
- Generates card HTML for each page with metadata
- Shows speaker/instructor info if available

**Key concept**: Block reads configuration directly from the table rows that authors create. Simple, flexible, and testable.

**Reference**: [Query Index Documentation](https://www.aem.live/developer/indexing)

---

## Step 3: Implement Styles

**File**: `blocks/page-list/page-list.css`

Copy this code:

```css
.page-list-cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 32px;
}

.page-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--background-color);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.page-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.page-card-image {
  line-height: 0;
}

.page-card-image img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.page-card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.page-card-body h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  line-height: 1.3;
}

.page-card-body h3 a {
  color: var(--text-color);
  text-decoration: none;
}

.page-card-body h3 a:hover {
  text-decoration: underline;
}

.page-card-description {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
  color: #666;
  flex: 1;
}

.page-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.page-card-tags .tag {
  display: inline-block;
  padding: 4px 12px;
  background: #f0f0f0;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  color: #333;
}

.page-card-meta {
  font-size: 13px;
  color: #999;
  margin: 8px 0 0 0;
  font-weight: 500;
}

@media (max-width: 600px) {
  .page-list-cards {
    grid-template-columns: 1fr;
  }
}
```

---

## Step 4: Commit Your Changes

```bash
# Run linting
npm run lint

# Add changes
git add blocks/page-list/

# Commit
git commit -m "feat: add page-list block for query index"

# Push
git push origin jsmith
```

Replace `jsmith` with your branch name.

---

## Step 5: Create Test Page - All Sessions

**In DA.live**, create page: `/drafts/jsmith/sessions-list` (use your name)

Add this content:

```
# All Sessions

Explore all masterclass sessions organized by topic.

| Page List |
|-----------|
| /sessions/ |
| 10 |
```

**What you're doing**:
- Row 1: Path to filter by (`/sessions/`)
- Row 2: Maximum number of results to show (`10`)

**Save** the page in DA.live.

---

## Step 6: Test with Sessions Data

**Open**: `http://localhost:3000/drafts/jsmith/sessions-list` (use your name)

**You should see**:
- Your heading "All Sessions"
- 7 session cards displaying automatically
- Each card shows:
  - Session title (linked to session page)
  - Description
  - Speaker name
  - Session time and level
  - Category and tags

**What happened**:
1. Block read configuration from authored content (`/sessions/`, limit `10`)
2. Fetched `query-index.json` from localhost
3. Filtered to pages where `path` starts with `/sessions/`
4. Sorted by published date (newest first)
5. Limited to 10 results (only 7 exist)
6. Rendered as cards

**Verify the data**:
- Click a session title link - should navigate to that session page
- Check that tags display correctly
- Verify speaker names show

---

## Step 7: Test with Labs Data

Create another test page: `/drafts/jsmith/labs-list` (use your name)

```
# All Labs

Hands-on labs to build your EDS skills.

| Page List |
|-----------|
| /labs/ |
| 10 |
```

**Save** and open: `http://localhost:3000/drafts/jsmith/labs-list`

**You should see**: 8 lab cards from `/labs/` path!

**Key insight**: Same block, different configuration → different filtered results. The block is reusable for any path.

---

## Step 8: Test Filtering by Category

Create a test page for only "development" content: `/drafts/jsmith/dev-content`

```
# Development Content

Sessions and labs focused on building with EDS.

| Page List |
|-----------|
| / |
| development |
| 10 |
```

**What you're doing**:
- Row 1: Path filter (`/` = all paths)
- Row 2: Category filter (`development`)
- Row 3: Limit (`10`)

**Save** and open: `http://localhost:3000/drafts/jsmith/dev-content`

**You should see**: Only pages with `category: development` from both sessions and labs.

**Try other categories**:
- `technical` - Show only technical sessions
- `authoring` - Show only authoring content
- `configuration` - Show only configuration labs

---

## Step 9: Understanding Auto-Blocking (Optional)

The current exercise uses manually authored Page List blocks. In production, you'd use **auto-blocking** to inject blocks automatically.

**Auto-blocking pattern**:
```javascript
// In scripts.js buildAutoBlocks function
const template = getMetadata('template');
if (template === 'section-landing') {
  // Auto-inject page-list block
  // Determine path from current URL
  // No manual block authoring needed
}
```

**Why auto-blocking?**
- Authors just set metadata, no block authoring
- Block automatically shows relevant content
- Consistent pattern across all section pages

**When you'd use this**:
- Blog category pages (all have same structure)
- Product category pages
- Section landing pages
- Any repeated pattern

**For this exercise**: We're focusing on query index concepts, not auto-blocking implementation. You'll see auto-blocking patterns demonstrated by instructors later.

---

## Configuring Custom Metadata

### Adding Custom Fields to Index

To index custom metadata fields, create `helix-query.yaml` at repo root:

```yaml
indices:
  default:
    include:
      - /events/**
    exclude:
      - /drafts/**
    target: /query-index.json
    properties:
      author:
        select: head > meta[name="author"]
        value: attribute(el, "content")
      category:
        select: head > meta[name="category"]
        value: attribute(el, "content")
      tags:
        select: head > meta[name="tags"]
        value: attribute(el, "content")
      publishedDate:
        select: head > meta[name="published-date"]
        value: parseTimestamp(attribute(el, "content"), "MM/DD/YYYY")
```

**Key concepts**:
- `select`: CSS selector to find the element in HTML
- `value`: Function to extract the value (attribute, textContent, etc.)
- `include`/`exclude`: Control what paths get indexed

**How it works**:
1. EDS scans published pages (.aem.live)
2. Uses CSS selectors to find meta tags
3. Extracts values using specified functions
4. Stores in query-index.json

**Reference**: [Indexing Reference](https://www.aem.live/docs/indexing-reference)

### Verify with Index Admin Tool

After configuring:
1. Publish pages to `.aem.live`
2. Wait 5-10 minutes for index to update
3. Go to https://tools.aem.live/tools/index-admin
4. Enter: `cloudadoption/nycmasterclass/main`
5. Check that your custom fields appear

**Troubleshooting**:
- Page missing? Check if published to `.aem.live` (not just `.aem.page`)
- Property missing? Verify CSS selector matches your HTML
- Wrong value? Check value expression function

---

## Real-World Applications

**Use Case 1: Blog with Category Pages**
- **Index fields**: author, category, publishDate, tags, readingTime
- **Page-List block**: Filter by category, sort by publishDate (newest first)
- **Display on**: Category landing pages (e.g., `/blog/development`)
- **Author experience**: Create article, set category in metadata, auto-appears on category page

**Use Case 2: Event Calendar/Sessions**
- **Index fields**: eventDate, speaker, location, eventType, session-time
- **Page-List block**: Filter by future dates, eventType, or speaker
- **Display on**: Main events page or speaker profile pages
- **Author experience**: Publish session, appears on calendar and speaker page automatically

**Use Case 3: Product Catalog**
- **Index fields**: price, availability, category, sku, brand
- **Page-List block**: Filter by category + availability, sort by price
- **Display on**: Category pages (e.g., `/products/laptops`)
- **Author experience**: Add product page, set metadata, appears on category page

**Use Case 4: Documentation Site**
- **Index fields**: section, difficulty, lastModified, version
- **Page-List block**: Filter by section, sort by difficulty or date
- **Display on**: Section landing pages and "What's New" pages
- **Author experience**: Publish doc page, auto-indexed and listed

**Common pattern**: Publish once → appears everywhere relevant automatically

---

## Key Takeaways

- **Query index** automatically maintains metadata for all published pages
- **Pre-generated at publish time** - no runtime database queries needed
- **Same JSON structure as Sheets** - reuse block patterns you already know
- **Filter by path** (e.g., `/sessions/**`) or **category** or both
- **Sort and limit** results in JavaScript for flexible displays
- **Configure custom fields** with `helix-query.yaml` using CSS selectors
- **Only published pages** (`.aem.live`) are indexed, not preview pages
- **Index Admin tool** helps verify configuration and data
- **Auto-blocking** (optional) can inject page-list blocks based on metadata templates

---

## Verification Checklist

- [ ] **Created page-list block files** (`page-list.js`, `page-list.css`)
- [ ] **Block fetches** `query-index.json` successfully from localhost
- [ ] **Block displays** session and lab cards correctly
- [ ] **Filtering by path** works (`/sessions/`, `/labs/`)
- [ ] **Filtering by category** works (`development`, `technical`, `authoring`)
- [ ] **Limit parameter** restricts results properly
- [ ] **Metadata displays** (speaker/instructor names, times, tags)
- [ ] **Cards link** to correct session/lab pages
- [ ] **Understand** how query-index.json is generated and updated
- [ ] **Understand** optional auto-blocking pattern (Step 9)
- [ ] **Committed and pushed** changes to feature branch

---

## References

- [Indexing Reference](https://www.aem.live/docs/indexing-reference)
- [Index Admin Tool](https://tools.aem.live/tools/index-admin)
- [EDS Indexing Concepts](https://www.aem.live/developer/indexing)

---

## Next Exercise

**Exercise 5**: JSON2HTML - Generate hundreds of pages from JSON data using templates. You'll learn how to create dynamic pages at scale without manually authoring each one.
