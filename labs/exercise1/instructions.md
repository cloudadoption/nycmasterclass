# Exercise 1: Authoring Your First Page

**Duration**: 20 minutes

---

## Prerequisites

✅ **Complete [SETUP.md](../SETUP.md) before starting this exercise.**

Required:
- Repository cloned locally
- Local dev server running at `http://localhost:3000`
- DA.live access verified at https://da.live/#/cloudadoption/nycmasterclass
- Personal folder created at `/drafts/jsmith/` (using your name)

**Your Personal Workspace**: Throughout this masterclass, you'll use a consistent naming format:
- **Format**: First initial + full last name, all lowercase
- **Examples**: John Smith → `jsmith`, Sarah Jones → `sjones`, Wei Chen → `wchen`
- **Used for**: DA.live folders (`/drafts/jsmith/`), Git branch names (`jsmith`)

---

## What You'll Learn

- How document semantics work in EDS
- How to author content in DA.live
- How blocks are structured
- The preview and publish workflow
- The difference between DA.live and EDS permissions

---

## Why This Matters

EDS uses a fundamentally different approach than traditional CMSs:

**Authors work in familiar tools** (Word, Google Docs) rather than complex admin UIs.

**Content is semantic** - simple tables and headings map directly to HTML, making it fast and accessible.

**Separation of concerns** - Authors focus on content structure, developers control presentation.

This exercise shows you the author's perspective. In Exercise 2, you'll see the developer's side.

---

## How It Works

```
1. Author creates content in DA.live (tables, headings, text)
2. DA.live converts to semantic HTML
3. EDS serves the HTML on preview (.aem.page)
4. Author publishes
5. EDS serves the HTML on live (.aem.live)
```

**Key concept**: Content structure (tables) defines blocks. Developers write JavaScript/CSS to decorate those blocks.

---

## Understanding Permissions

**DA.live permissions** (content authoring):
- `read` - View content and configs
- `write` - Create, edit, delete content
- Managed in DA.live config sheet

**EDS permissions** (preview & publish):
- `preview:read`, `preview:write` - Work with `.aem.page`
- `live:write` - Publish to `.aem.live`
- Managed via EDS Admin API

You should have:
- DA.live `write` permission on `/drafts/jsmith/` (replace `jsmith` with your first initial + last name, all lowercase)
- EDS `publish` role (includes preview and live permissions)

**Your name format**: First initial + full last name, all lowercase
- John Smith → `jsmith`
- Sarah Jones → `sjones`
- Wei Chen → `wchen`

**References**:
- [DA.live Permissions](https://docs.da.live/administrators/guides/permissions)
- [EDS Authentication](https://www.aem.live/docs/authentication-setup-authoring)

---

## Document Semantics

### Basic Elements

```
# Heading 1          →  <h1>Heading 1</h1>
## Heading 2         →  <h2>Heading 2</h2>
Paragraph text       →  <p>Paragraph text</p>
![Image](url)        →  <img src="optimized.jpg" alt="Image">
[Link](url)          →  <a href="url">Link</a>
```

### Blocks

Tables with a name in the first cell become blocks:

```
| Hero                    |
|-------------------------|
| Welcome to Masterclass  |
| Join us in NYC          |
```

Becomes:

```html
<div class="hero">
  <div><div>Welcome to Masterclass</div></div>
  <div><div>Join us in NYC</div></div>
</div>
```

**The contract**: Authors create the table structure, developers write `blocks/hero/hero.js` to decorate it.

**References**:
- [Markup, Sections, Blocks](https://www.aem.live/developer/markup-sections-blocks)
- [Document Semantics](https://www.aem.live/blog/content-document-semantics)

---

## Before You Start: Review Existing Pages

Before creating your page, look at the structure of existing content:

**Session pages**: 
- https://da.live/edit#/cloudadoption/nycmasterclass/sessions/architecture-deep-dive
- http://localhost:3000/sessions/architecture-deep-dive

**Lab pages**:
- https://da.live/edit#/cloudadoption/nycmasterclass/labs/authoring-first-page
- http://localhost:3000/labs/authoring-first-page

**What to notice**:
- How Hero blocks are structured
- The content sections (Overview, Learning Objectives, Key Topics)
- Metadata fields used
- Overall page structure

---

## Step 1: Create a Session or Lab Page

Choose to create either a **session page** or a **lab page** - your choice!

1. Go to https://da.live/#/cloudadoption/nycmasterclass
2. Navigate to `/drafts/<your-name>/`
   - **Format**: First initial + full last name, all lowercase
   - **Example**: John Smith → `jsmith`, Sarah Jones → `sjones`
   - This is your personal workspace for the masterclass
3. If your folder doesn't exist, create it: Click **New** → **Folder** → Name it with your format
4. Inside your folder, click **New** → **Page**
5. Name it: `my-session` or `my-lab`

**Why this matters**: You're creating real content for the masterclass site, not throwaway practice content. You're learning by building something meaningful.

**Note**: This same naming convention (`jsmith`) will be used for your GitHub branch name in Exercise 2.

---

## Step 2: Add a Hero Block

In the page editor, add this content:

```
| Hero |
|------|
| [Your Session/Lab Title] |
| [View Schedule](https://main--nycmasterclass--cloudadoption.aem.page/schedule) |
```

**Example for a session**:
```
| Hero |
|------|
| Testing Strategies for EDS |
| [View Schedule](https://main--nycmasterclass--cloudadoption.aem.page/schedule) |
```

**Example for a lab**:
```
| Hero |
|------|
| Building a Search Block |
| [View Lab Schedule](https://main--nycmasterclass--cloudadoption.aem.page/schedule) |
```

**What you're doing**: Creating a table that will become a `<div class="hero">` block with a title and link to schedule.

---

## Step 3: Add Session/Lab Overview

Below the Hero block, add:

```
## Session Overview

[Describe what this session/lab is about - 2-3 sentences]

## What You'll Learn

- [Learning objective 1]
- [Learning objective 2]
- [Learning objective 3]
- [Learning objective 4]

## Key Topics

**[Topic 1 Name]**
[1-2 sentences explaining this topic]

**[Topic 2 Name]**
[1-2 sentences explaining this topic]

**[Topic 3 Name]**
[1-2 sentences explaining this topic]

## Who Should Attend

[Describe the target audience - developers, architects, authors, etc.]
```

**What you're doing**: Adding semantic HTML (headings, paragraphs, lists) that needs no decoration. Look at `/sessions/architecture-deep-dive` or `/labs/authoring-first-page` for real examples.

---

## Step 4: Add Metadata

At the very bottom of the page, add:

**For a session**:
```
| Metadata       |                                           |
|----------------|-------------------------------------------|
| Title          | [Session Title] - NYC Masterclass         |
| Description    | [Short description for SEO]               |
| speaker-name   | [Speaker Name]                            |
| category       | technical                                 |
| tags           | [tag1, tag2, tag3]                        |
| published-date | 02/01/2026                                |
| session-level  | beginner / intermediate / advanced        |
| session-time   | Day X - XX:XXa - XX:XXa                   |
```

**For a lab**:
```
| Metadata       |                                           |
|----------------|-------------------------------------------|
| Title          | Lab X: [Lab Title] - NYC Masterclass      |
| Description    | [Short description for SEO]               |
| instructor-name| [Instructor Name]                         |
| category       | development / authoring / configuration   |
| tags           | [tag1, tag2]                              |
| published-date | 02/01/2026                                |
| difficulty     | beginner / intermediate / advanced        |
| lab-time       | Day X - XX:XXa - XX:XXa                   |
```

**What you're doing**: Setting page metadata for SEO and classification. This data powers search, filtering, and organization.

**Important**: Metadata block must be last on the page.

---

## Step 5: Save and Preview

1. Click **Save** in DA.live
2. Click **Preview**
3. Your page opens at: `http://localhost:3000/drafts/jsmith/my-session` (replace `jsmith` with your name)

**What you should see**:
- Hero block at the top with your title
- Session/lab overview and learning objectives
- Key topics with headings
- Everything styled by existing CSS in the repo

**Compare with real pages**:
- http://localhost:3000/sessions/architecture-deep-dive
- http://localhost:3000/labs/authoring-first-page

---

## Step 6: Understanding Document Semantics

This is a critical step that reveals how EDS transforms simple content into performant web experiences. You'll inspect your page at three different stages of the transformation process.

### 6.1: View Document Source (Author's View)

1. With your page open at `http://localhost:3000/drafts/jsmith/my-session` (use your name)
2. Right-click on the **AEM Sidekick** extension icon in your browser
3. Select **View document source**

**What you'll see**: The raw HTML as it exists in DA.live before any EDS processing. Notice:
- Tables are still just tables
- No `class="hero"` or block decorations yet
- Simple, clean semantic HTML
- This is exactly what the author creates

**Key insight**: Authors work with pure semantic HTML. No CSS classes, no JavaScript complexity.

---

### 6.2: View Plain HTML (EDS Processing)

Open in a new tab (replace `jsmith` with your name):
```
http://localhost:3000/drafts/jsmith/my-session.plain.html
```

**What you'll see**: HTML after EDS processing but before JavaScript decoration. Notice:
- Your Hero table is now `<div class="hero"><div><div>...</div></div></div>`
- Content is wrapped in section divs (`<div>...</div>`)
- Block structure is defined but not yet decorated
- Metadata is processed but not visible in the page

**Key insight**: EDS transforms tables into semantic block structures. The table header becomes the block class name.

**Compare**: Open both document source and .plain.html side-by-side. See how:
- `| Hero |` table → `<div class="hero">`
- `| Metadata |` table → processed into `<head>` tags
- Simple content stays simple (headings, paragraphs, lists)

---

### 6.3: View Markdown Source (Content Format)

Open in a new tab (replace `jsmith` with your name):
```
http://localhost:3000/drafts/jsmith/my-session.md
```

**What you'll see**: Markdown representation of your content. Notice:
- Tables shown as markdown tables
- Headings as `##` format
- Lists with `-` or `*` bullets
- This is how content could be edited in text editors

**Key insight**: EDS stores content in a universal format that can be rendered as HTML, edited as markdown, or consumed as JSON.

---

### 6.4: View JSON API (Structured Data)

Open in a new tab (replace `jsmith` with your name):
```
http://localhost:3000/drafts/jsmith/my-session.json
```

**What you'll see**: Structured data representation with metadata included. Notice:
- Page content as JSON arrays
- Metadata as separate object
- Easy for programmatic access
- Powers dynamic features like search, page lists

**Key insight**: Every page is API-accessible. No separate API to build or maintain.

---

### Understanding the Flow

```
Author creates content in DA.live
        ↓
    Simple HTML (tables, headings, text)
        ↓ [View Document Source]
        ↓
EDS processes structure
        ↓
    Semantic blocks (.plain.html)
        ↓ [View .plain.html]
        ↓
JavaScript decorates blocks
        ↓
    Styled, interactive page
        ↓ [View in browser]
```

**Key Principle**: Content flows from simple (author-friendly) to sophisticated (developer-controlled) without complexity for the author.

**Exercise**: Compare your page to an existing session:
1. View document source for `/sessions/architecture-deep-dive`
2. View .plain.html for the same page
3. See how tables become blocks
4. Notice how metadata is structured
5. See the final rendered result

This progression from authored content → semantic structure → decorated blocks is the core of how EDS maintains both authoring simplicity and developer flexibility.

**References**:
- [DA.live API](https://docs.da.live/developers/api)
- [EDS Admin API](https://www.aem.live/docs/admin.html)

---

## Step 7: Publish Your Page

1. In DA.live, click **Publish** on your page
2. Wait for confirmation

**What happened**:
- DA.live called EDS Admin API
- Content copied from preview (`.aem.page`) to live (`.aem.live`)
- CDN caches updated
- Your session/lab is now publicly accessible!

### View on Your Branch

**Preview**:
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/drafts/jsmith/my-session
```

**Live**:
```
https://jsmith--nycmasterclass--cloudadoption.aem.live/drafts/jsmith/my-session
```

Replace `jsmith` with your name (first initial + last name, all lowercase). Your GitHub branch name will use this same format.

**Example URLs** (if your name is Sarah Jones):
- Preview: `https://sjones--nycmasterclass--cloudadoption.aem.page/drafts/sjones/my-session`
- Live: `https://sjones--nycmasterclass--cloudadoption.aem.live/drafts/sjones/my-session`

---

## Understanding the Architecture

```
┌─────────────┐
│  DA.live    │  Content authoring & management
│ (Authoring) │  - Create/edit pages
│             │  - Manage assets
└──────┬──────┘  - API: list, create, update content
       │
       │ DA.live API
       ↓
┌──────────────┐
│ EDS Preview  │  Preview environment
│ (.aem.page)  │  - Test before publishing
└──────┬───────┘  - Shows latest saved content
       │
       │ EDS Admin API (publish)
       ↓
┌──────────────┐
│  EDS Live    │  Production environment
│ (.aem.live)  │  - Public-facing site
└──────────────┘  - Only published content
```

**Key principles**:
- **Separation**: Authoring and delivery are separate services
- **API-First**: All interactions via REST APIs
- **Multi-Representation**: HTML, MD, JSON for every resource

---

## Real-World Applications

**Use Case 1: Marketing Campaign Pages**
- Authors create landing pages in Word/Docs
- No developer involvement for content changes
- Fast iteration, publish in seconds

**Use Case 2: Product Documentation**
- Technical writers use familiar tools
- Developers control layout via blocks
- SEO metadata controlled by authors

**Use Case 3: Multi-Language Sites**
- Each language in separate folder
- Shared blocks/code
- Authors manage translations

---

## Key Takeaways

- **Authors work with simple semantics**: DA.live stores clean HTML without CSS classes or JavaScript complexity
- **Tables become blocks**: A table with a header row (`| Hero |`) becomes a styled block (`<div class="hero">`)
- **Three views reveal the transformation**:
  - Document source = What authors create
  - .plain.html = How EDS structures it
  - Final page = How developers style it
- **Every page is multi-format**: HTML, Markdown, and JSON representations enable different use cases
- **Separate environments**: Preview (.aem.page) for testing, Live (.aem.live) for production
- **Two permission systems**: DA.live (content authoring) and EDS Admin API (preview/publish)
- **Metadata is powerful**: Drives SEO, search, classification, and dynamic features
- **Patterns scale**: Session/lab structure is consistent, making it easy to create more pages

---

## Verification Checklist

- [ ] Created session or lab page in DA.live
- [ ] Added Hero block with title and schedule link
- [ ] Added session/lab overview and learning objectives
- [ ] Added metadata block with appropriate fields
- [ ] Previewed locally and saw styled content
- [ ] **Viewed document source** (via AEM Sidekick right-click)
- [ ] **Viewed .plain.html** and understood block structure transformation
- [ ] **Viewed .md** representation
- [ ] **Viewed .json** API format
- [ ] **Compared** document source vs .plain.html vs final page
- [ ] Published page
- [ ] Viewed on branch preview and live URLs
- [ ] Understand DA.live vs EDS permissions
- [ ] Understand the content → structure → styled flow

---

## References

- [Markup Reference](https://www.aem.live/developer/markup-sections-blocks)
- [Document Semantics](https://www.aem.live/blog/content-document-semantics)
- [DA.live Permissions](https://docs.da.live/administrators/guides/permissions)
- [EDS Authentication](https://www.aem.live/docs/authentication-setup-authoring)
- [DA.live API](https://docs.da.live/developers/api)
- [EDS Admin API](https://www.aem.live/docs/admin.html)

---

## Next Exercise

**Exercise 2**: Block Development - You'll see the developer's side of the story. Learn how to build block variations (eyebrow, list) for the Cards block and write the JavaScript/CSS that transforms the tables you just created into styled, responsive components.
