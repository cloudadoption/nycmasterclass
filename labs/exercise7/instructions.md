# Exercise 7: DA.live Plugin Development

**Duration**: 30 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Exercises 1-6 completed
- Access to DA.live (you should already be authoring there)

**Your Personal Workspace**: All work in `/drafts/jsmith/` (use your name: first initial + last name, lowercase)

**Understanding DA.live Context**:
- You've been authoring content in DA.live (Exercises 1-6)
- Now you'll extend DA.live itself with custom tools
- Plugins help authors insert pre-formatted content consistently

---

## What You'll Learn

- How DA.live plugins work as library integrations
- How to use the DA App SDK (context, token, actions)
- How to insert content into documents programmatically via PostMessage API
- How to develop plugins locally and deploy to your branch
- How plugins are accessed through the library palette

---

## Why This Matters

DA.live library plugins extend the authoring experience with custom content insertion capabilities.

**The challenge**: Authors need to insert metadata blocks, pre-formatted sections, or external data consistently. Copy-pasting is error-prone.

**The solution**: Create plugins that insert pre-formatted content with one click.

**Plugins enable**:
- **Pre-formatted content templates** - Metadata blocks, section layouts
- **Integration with external data sources** - Fetch from APIs, databases
- **Automated content generation** - Dynamic content based on rules
- **Streamlined authoring workflows** - One-click insertion, no copy-paste
- **Consistency** - Same structure across all pages
- **Custom tooling** - Build exactly what your authors need

**The pattern**:
```
1. Developer builds plugin (HTML + JavaScript)
2. Plugin uses DA App SDK (context, token, actions)
3. Plugin hosted on your AEM site (committed to Git)
4. Authors access via library palette in DA.live
5. Plugin inserts content into document via SDK actions
```

**Real-world use cases**:
- **Metadata templates** - Insert pre-configured metadata blocks
- **Section libraries** - Pre-formatted hero sections, CTAs, footers
- **Product catalog** - Fetch products from PIM, insert as tables
- **Speaker directory** - Insert speaker bio from API
- **Asset browser** - Browse DAM, insert images with correct paths
- **Form builders** - Generate form markup from templates
- **Legal snippets** - Insert disclaimers, copyright notices

---

## How DA.live Plugins Work

DA.live plugins are HTML + JavaScript applications hosted on your Edge Delivery site that communicate with DA.live via the DA App SDK.

**Architecture**:
```
┌─────────────────────────────────────────────────┐
│            DA.live Editor                       │
│                                                 │
│  ┌───────────────────┐  ┌──────────────────┐  │
│  │  Document Editor  │  │  Library Palette │  │
│  │                   │  │                  │  │
│  │  [Your Content]   │  │  [Plugin loads   │  │
│  │                   │  │   in iframe]     │  │
│  └────────┬──────────┘  └────────┬─────────┘  │
│           │                      │             │
│           │ PostMessage API      │             │
│           │ (via DA App SDK)     │             │
│           └──────────────────────┘             │
└─────────────────────────────────────────────────┘
                       │
                       │ Loads plugin from:
                       │ https://jsmith--nycmasterclass--cloudadoption.aem.page/
                       │         tools/metadata-template.html
                       ▼
           ┌───────────────────────────┐
           │   Your Plugin (iframe)    │
           │                           │
           │  • HTML + JavaScript      │
           │  • Uses DA App SDK        │
           │  • Sends content via SDK  │
           └───────────────────────────┘
```

**How it works**:
1. Plugin is an **HTML page** on your Edge Delivery site
2. Plugin loads in **iframe** within DA.live library palette
3. Plugin uses **DA App SDK** (imported from da.live)
4. SDK provides **PostMessage API** for secure communication
5. SDK gives you: **context** (document info), **token** (auth), **actions** (insert content)
6. Plugin calls `actions.sendText()` or `actions.sendHTML()` to insert content
7. DA.live receives message and inserts into document

**URL Structure**:
- **Your codebase**: `https://jsmith--nycmasterclass--cloudadoption.aem.page/tools/metadata-template.html`
- **DA.live app URL**: `https://da.live/app/cloudadoption/nycmasterclass/tools/metadata-template?ref=jsmith`
- **Local development**: `https://da.live/app/cloudadoption/nycmasterclass/tools/metadata-template?ref=local`

**Key concept**: DA.live loads your plugin HTML from your AEM site into an iframe, then uses PostMessage for secure cross-origin communication.

**Reference**: [Developing Apps and Plugins](https://docs.da.live/developers/guides/developing-apps-and-plugins)

---

## Understanding the DA App SDK

The DA App SDK is the bridge between your plugin and DA.live. It provides three key objects:

### 1. **context** - Document Information

Information about the current document being edited:

```javascript
const { context } = await DA_SDK;

console.log(context.org);      // "cloudadoption"
console.log(context.repo);     // "nycmasterclass"
console.log(context.ref);      // "main" or branch name
console.log(context.path);     // "/drafts/jsmith/my-page"
```

**Use cases**:
- Branch-aware plugins (behave differently on main vs feature branches)
- Path-based logic (different templates for different paths)
- Org/repo-aware plugins (multi-tenant plugins)

### 2. **token** - Authentication Token

Authentication token for making authenticated API calls to DA.live Admin API:

```javascript
const { token } = await DA_SDK;

// Use for authenticated API calls
const response = await fetch('https://admin.da.live/source/org/repo/path', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Use cases**:
- Fetch data from DA.live Admin API
- Read other documents
- Access media index
- Query content

### 3. **actions** - Document Interaction Methods

Methods to insert content into the active document:

```javascript
const { actions } = await DA_SDK;

// Insert plain text (markdown)
await actions.sendText('# Heading\n\nParagraph text');

// Insert HTML
await actions.sendHTML('<div><h1>Heading</h1><p>Paragraph</p></div>');

// Close library palette
await actions.closeLibrary();
```

**Key insight**: You don't manipulate the document directly. You send content to DA.live, and DA.live inserts it.

**Why PostMessage?**: Your plugin runs in an iframe (different origin). PostMessage is the secure way to communicate across origins.

---

## Plugin Architecture

For this exercise, you'll build a **metadata template plugin** with two files:

### Required Files:

1. **HTML file** (`metadata-template.html`)
   - Imports DA App SDK from `https://da.live/nx/utils/sdk.js`
   - Imports your plugin JavaScript
   - Defines UI (template options)
   - Includes styles

2. **JavaScript file** (`metadata-template.js`)
   - Imports DA App SDK
   - Waits for SDK initialization (`await DA_SDK`)
   - Creates interactive UI
   - Handles clicks → sends content → closes library

### Plugin Structure:

```
tools/
  metadata-template/
    metadata-template.html   ← Loaded by DA.live in iframe
    metadata-template.js     ← Your plugin logic
```

**URL accessed by authors**:
```
https://da.live/app/cloudadoption/nycmasterclass/tools/metadata-template?ref=jsmith
```

This loads your HTML from:
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/tools/metadata-template/metadata-template.html
```

---

## Step 1: Create Plugin HTML

**File**: `tools/metadata-template/metadata-template.html`

Copy this code:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Metadata Template Plugin</title>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <link rel="icon" href="data:,">
    <script src="https://da.live/nx/utils/sdk.js" type="module"></script>
    <script src="/tools/metadata-template/metadata-template.js" type="module"></script>
    <style>
      body {
        font-family: adobe-clean, sans-serif;
        padding: 20px;
        margin: 0;
      }

      h2 {
        margin: 0 0 16px 0;
        font-size: 18px;
      }

      .template-option {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: border-color 0.2s ease, background 0.2s ease;
      }

      .template-option:hover {
        border-color: #1473e6;
        background: #f5f5f5;
      }

      .template-option h3 {
        margin: 0 0 8px 0;
        font-size: 16px;
        color: #1473e6;
      }

      .template-option p {
        margin: 0;
        font-size: 14px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <h2>Insert Metadata Template</h2>
    <div id="templates"></div>
  </body>
</html>
```

---

## Step 2: Create Plugin JavaScript

**File**: `tools/metadata-template/metadata-template.js`

Copy this code:

```javascript
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

/**
 * Metadata Template Plugin
 * Provides pre-formatted metadata templates for consistent page setup
 */

const TEMPLATES = [
  {
    name: 'Event Page',
    description: 'Metadata for event landing pages',
    metadata: {
      Title: 'Event Name - NYC Masterclass 2026',
      Description: 'Join us for an intensive workshop on Edge Delivery Services',
      'og:image': '/images/event-default.jpg',
      template: 'section-landing',
      category: 'event',
    },
  },
  {
    name: 'Speaker Profile',
    description: 'Metadata for speaker profile pages',
    metadata: {
      Title: 'Speaker Name - NYC Masterclass 2026',
      Description: 'Learn from industry experts',
      'og:image': '/images/speaker-default.jpg',
      template: 'profile',
      category: 'speaker',
    },
  },
  {
    name: 'Session Page',
    description: 'Metadata for workshop sessions',
    metadata: {
      Title: 'Session Title - NYC Masterclass 2026',
      Description: 'Deep dive into EDS concepts',
      'og:image': '/images/session-default.jpg',
      template: 'session',
      category: 'workshop',
      tags: 'development, hands-on',
    },
  },
];

/**
 * Converts metadata object to table markdown
 */
function metadataToMarkdown(metadata) {
  let markdown = '| Metadata | |\n';
  markdown += '|----------|------------------|\n';

  Object.entries(metadata).forEach(([key, value]) => {
    markdown += `| ${key} | ${value} |\n`;
  });

  return markdown;
}

/**
 * Initialize plugin
 */
(async function init() {
  const { context, token, actions } = await DA_SDK;

  const container = document.getElementById('templates');

  // Create template options
  TEMPLATES.forEach((template) => {
    const option = document.createElement('div');
    option.className = 'template-option';
    option.innerHTML = `
      <h3>${template.name}</h3>
      <p>${template.description}</p>
    `;

    option.addEventListener('click', async () => {
      // Convert metadata to markdown table
      const markdown = metadataToMarkdown(template.metadata);

      // Insert into document
      await actions.sendText(markdown);

      // Close library palette
      await actions.closeLibrary();
    });

    container.append(option);
  });
}());
```

**What this does**:
- Imports DA App SDK
- Waits for SDK initialization
- Receives `context`, `token`, `actions` from SDK
- Creates clickable template options
- Converts metadata object to markdown table
- Uses `actions.sendText()` to insert into document
- Uses `actions.closeLibrary()` to close palette

---

## Step 3: Commit Plugin Files

```bash
# Run linting (HTML files don't need linting)
npm run lint

# Add changes
git add tools/metadata-template/

# Commit
git commit -m "feat: add DA metadata template plugin"

# Push
git push origin jsmith
```

Replace `jsmith` with your branch name.

---

## Step 4: Test Plugin Locally First

Before pushing to your branch, test the plugin loads correctly from localhost.

**With your dev server running** (`aem up` or `npx @adobe/aem-cli up`):

**Plugin URL for local testing**:
```
https://da.live/app/cloudadoption/nycmasterclass/tools/metadata-template?ref=local
```

**To test**:
1. **Open DA.live**: Go to `https://da.live/edit#/cloudadoption/nycmasterclass/drafts/jsmith/` (use your name)
2. **Open any existing page** (or create `/drafts/jsmith/plugin-test`)
3. **Open library**: Click the library icon in the left sidebar (puzzle piece icon)
4. **Load your plugin**: In a new browser tab, navigate to:
   ```
   https://da.live/app/cloudadoption/nycmasterclass/tools/metadata-template?ref=local
   ```
5. **You should see**: Your plugin UI loads with three template options
6. **Click "Event Page"**: The metadata table should insert into your document
7. **Library should close** automatically

**Debugging local issues**:
- Verify `http://localhost:3000` is running
- Check browser console for errors
- Verify file paths: `/tools/metadata-template/metadata-template.html`
- Check Network tab for failed requests

**How `?ref=local` works**: DA.live fetches your plugin HTML from `http://localhost:3000` instead of the published site. This lets you develop without committing/pushing every change.

---

## Step 5: Access Plugin on Your Branch

Once local testing works, access your plugin from your pushed branch.

**Your plugin URL** (replace `jsmith` with your branch):
```
https://da.live/app/cloudadoption/nycmasterclass/tools/metadata-template?ref=jsmith
```

**To test on your branch**:
1. **Ensure you've pushed** to GitHub (`git push origin jsmith`)
2. **Wait 1-2 minutes** for AEM Code Sync to deploy
3. **Open DA.live** and navigate to any page
4. **Load your plugin URL** with `?ref=jsmith` in a new tab
5. **Plugin loads from**:
   ```
   https://jsmith--nycmasterclass--cloudadoption.aem.page/tools/metadata-template/metadata-template.html
   ```
6. **Test all three templates** to verify they work

**Testing checklist**:
- [ ] "Event Page" template inserts correct metadata
- [ ] "Speaker Profile" template inserts correct metadata
- [ ] "Session Page" template inserts correct metadata with tags
- [ ] Library palette closes after insertion
- [ ] Metadata table format is correct (two columns)

---

## Step 6: Optional - Register Plugin in Library

For production use, plugins should be registered in the site configuration so authors can discover them automatically.

**To register your plugin** (instructor may do this):

1. **Edit site config**: Open `https://da.live/edit#/cloudadoption/nycmasterclass/config.json`
2. **Add to library sheet**:
   | title | path |
   |-------|------|
   | Metadata Templates | https://content.da.live/cloudadoption/nycmasterclass/tools/metadata-template |

3. **Save and publish** the config

**Once registered**:
- Plugin appears automatically in library palette
- Authors don't need to know the URL
- Works on main branch for production use

**For this exercise**: Manual URL loading is sufficient. Registration is optional.

---

## Troubleshooting Common Issues

### Plugin doesn't load (blank iframe)

**Problem**: Plugin URL shows blank page or 404

**Fixes**:
1. **Check file paths**: Verify files exist at `/tools/metadata-template/metadata-template.html`
2. **Check dev server**: Ensure `aem up` is running for `?ref=local`
3. **Check branch deployment**: Wait 1-2 minutes after `git push` for Code Sync
4. **Check URL**: Verify `?ref=jsmith` matches your branch name exactly
5. **Open plugin URL directly**: Visit the .aem.page URL in a new tab to see errors

### SDK import fails

**Problem**: Console error: "Failed to import DA_SDK"

**Fixes**:
1. **Check SDK URL**: Must be `https://da.live/nx/utils/sdk.js` (exact case)
2. **Check script type**: Must have `type="module"` in both HTML script tags
3. **Check CORS**: DA.live must be able to load your plugin (check browser console)

### Content doesn't insert

**Problem**: Clicking template does nothing

**Fixes**:
1. **Check console**: Look for JavaScript errors
2. **Verify SDK initialization**: `await DA_SDK` must complete before using `actions`
3. **Check markdown format**: Ensure table syntax is correct (`| Header |`, `|--------|`)
4. **Test with simple text**: Try `await actions.sendText('test')` first

### Library doesn't close

**Problem**: Library stays open after insertion

**Fixes**:
1. **Check call**: Ensure `await actions.closeLibrary()` is called
2. **Check await**: Must use `await` (it's async)
3. **Check errors**: Look for JavaScript errors preventing execution

### Plugin loads but shows errors

**Problem**: Plugin UI broken or shows JavaScript errors

**Fixes**:
1. **Open browser DevTools**: Check Console tab for errors
2. **Check file paths**: Verify JavaScript import path matches file location
3. **Check syntax**: Validate JSON in TEMPLATES array
4. **Test locally first**: Use `?ref=local` to debug before pushing

### Can't access plugin in DA.live

**Problem**: DA.live doesn't let you load plugin URL

**Fixes**:
1. **Check permissions**: Ensure you have access to cloudadoption/nycmasterclass
2. **Check URL format**: Must start with `https://da.live/app/`
3. **Check ref parameter**: Must include `?ref=jsmith` or `?ref=local`
4. **Try main branch**: Test with `?ref=main` to isolate branch issues

**Debugging with Browser DevTools**:
1. Open plugin URL in new tab
2. Right-click → Inspect
3. Check Console tab for JavaScript errors
4. Check Network tab for failed requests (SDK, JavaScript files)
5. Check Elements tab to verify HTML structure

---

## Real-World Plugin Examples

### Use Case 1: Speaker Directory Plugin
- **Fetch speaker data** from `/speakers.json` or external API
- **Display list** of speakers with photos and names
- **Click to insert**: Selected speaker bio as formatted table
- **Bonus**: Use `token` to fetch authenticated data from DA.live Admin API

**Example flow**:
```javascript
const { token, actions } = await DA_SDK;

// Fetch speakers with auth
const response = await fetch('/speakers.json', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const { data } = await response.json();

// Display in plugin UI, insert on click
speakers.forEach(speaker => {
  button.onclick = async () => {
    await actions.sendText(`## ${speaker.Name}\n${speaker.Bio}`);
    await actions.closeLibrary();
  };
});
```

### Use Case 2: Section Library Plugin
- **Pre-formatted section layouts**: Hero, CTA, Testimonials, FAQ
- **Click to insert**: Full section markup (with blocks)
- **Variant support**: Multiple designs per section type
- **Use case**: Ensure consistent design system compliance

**Example templates**:
- Hero with centered text + background image
- CTA with button + icon
- Testimonial with quote + photo + name
- FAQ accordion with expandable items

### Use Case 3: DAM Asset Browser
- **Browse DAM** or external asset library (Cloudinary, Bynder)
- **Search and filter** images by tags, categories
- **Insert with proper markdown**: Optimized image syntax
- **Auto-generate alt text**: From asset metadata

**Example flow**:
```javascript
// Fetch assets from DAM
const assets = await fetchFromDAM(token);

// Display thumbnails
assets.forEach(asset => {
  thumbnail.onclick = async () => {
    const markdown = `![${asset.alt}](${asset.url})`;
    await actions.sendText(markdown);
    await actions.closeLibrary();
  };
});
```

### Use Case 4: Product Catalog Plugin
- **Fetch products** from PIM (Product Information Management system)
- **Search by SKU**, name, category
- **Insert as table**: Product specs, price, images
- **E-commerce sites**: Consistent product page structure

### Use Case 5: Form Builder Plugin
- **Select form type**: Contact, Registration, Survey
- **Configure fields**: Name, email, message, etc.
- **Generate markup**: Form block with proper structure
- **Validation rules**: Built into generated code

### Use Case 6: Legal Snippets Library
- **Pre-approved legal text**: Privacy policies, disclaimers, copyright
- **Version controlled**: Always use latest approved version
- **Compliance**: Ensure legal requirements met
- **Multi-language support**: Insert in author's language

### Use Case 7: AI Content Generator
- **Generate content** via OpenAI, Claude, etc.
- **Input**: Title, keywords, tone
- **Output**: Generated paragraphs, summaries
- **Insert directly**: Author can edit after insertion

**Common pattern**:
```javascript
// 1. Fetch/generate data
const data = await fetchData(context, token);

// 2. Display in UI
renderUI(data);

// 3. Handle clicks
buttons.forEach(btn => {
  btn.onclick = async () => {
    const content = formatContent(data);
    await actions.sendText(content);
    await actions.closeLibrary();
  };
});
```

---

## Key Takeaways

- **DA.live plugins** are HTML + JavaScript applications hosted on your Edge Delivery site
- **DA App SDK** (`https://da.live/nx/utils/sdk.js`) provides the interface to DA.live
- **PostMessage API** enables secure cross-origin communication (plugin in iframe)
- **Three SDK objects**: `context` (document info), `token` (auth), `actions` (insert content)
- **Two insertion methods**: `actions.sendText()` (markdown) and `actions.sendHTML()` (HTML)
- **Plugin URL pattern**: `https://da.live/app/{org}/{repo}/{path}?ref={branch}`
- **Local development**: Use `?ref=local` to load from `localhost:3000`
- **Branch testing**: Use `?ref=jsmith` to load from your feature branch
- **Production use**: Register plugins in site config for automatic library discovery
- **Plugin architecture**: HTML (UI) + JavaScript (logic) + SDK (communication)

**Why plugins?**
- **Consistency** - Same templates across all pages
- **Speed** - One-click insertion vs manual copy-paste
- **Integration** - Pull from external systems (APIs, DAMs, PIMs)
- **Automation** - Generate content programmatically
- **Validation** - Enforce structure and rules

**The pattern**: UI → User Click → Generate Content → `actions.sendText()` → DA.live inserts → `actions.closeLibrary()`

---

## Verification Checklist

- [ ] **Created plugin files**:
  - `/tools/metadata-template/metadata-template.html`
  - `/tools/metadata-template/metadata-template.js`
- [ ] **Tested locally** with `?ref=local` (dev server running)
- [ ] **Plugin loads** in library palette (no errors)
- [ ] **All three templates work**:
  - "Event Page" inserts correct metadata
  - "Speaker Profile" inserts correct metadata
  - "Session Page" inserts correct metadata with tags
- [ ] **Content inserts correctly** as markdown table (two columns)
- [ ] **Library closes** automatically after insertion
- [ ] **Committed and pushed** to feature branch (`git push origin jsmith`)
- [ ] **Tested on branch** with `?ref=jsmith` parameter
- [ ] **Understand DA App SDK**:
  - `context` provides document info
  - `token` provides auth for API calls
  - `actions.sendText()` inserts markdown
  - `actions.closeLibrary()` closes palette
- [ ] **Understand PostMessage pattern** - Secure iframe communication
- [ ] **Understand URL structure** - `da.live/app/{org}/{repo}/{path}?ref={branch}`
- [ ] **Know how to debug** - Browser DevTools, Console, Network tab
- [ ] **Optional: Understand plugin registration** in site config

---

## Optional Enhancements

If you finish early, try these enhancements to your plugin:

### Enhancement 1: Add More Templates

Add templates for other page types:
- Lab page template
- Blog post template
- Landing page template

```javascript
{
  name: 'Lab Page',
  description: 'Metadata for hands-on lab pages',
  metadata: {
    Title: 'Lab Title - NYC Masterclass 2026',
    Description: 'Hands-on learning experience',
    'og:image': '/images/lab-default.jpg',
    category: 'lab',
    difficulty: 'intermediate',
  },
}
```

### Enhancement 2: Dynamic Values

Use `context` to make templates smarter:

```javascript
const { context } = await DA_SDK;

// Auto-populate title based on current path
const pageName = context.path.split('/').pop();
metadata.Title = `${pageName} - NYC Masterclass 2026`;
```

### Enhancement 3: Fetch External Data

Fetch templates from an external JSON:

```javascript
const response = await fetch('/templates/metadata-templates.json');
const templates = await response.json();
// Render dynamically fetched templates
```

### Enhancement 4: Better UI

- Add search/filter for templates
- Add preview of generated content
- Add form inputs for customization
- Add validation before insertion

### Enhancement 5: Use `sendHTML()` for Rich Content

Instead of markdown tables, insert rich HTML:

```javascript
const html = `
<div class="metadata">
  <table>
    <tr><td>Title</td><td>${metadata.Title}</td></tr>
    <tr><td>Description</td><td>${metadata.Description}</td></tr>
  </table>
</div>
`;
await actions.sendHTML(html);
```

---

## References

- **[Developing Apps and Plugins](https://docs.da.live/developers/guides/developing-apps-and-plugins)** - Official guide
- **[DA App SDK Source](https://da.live/nx/utils/sdk.js)** - SDK code (inspect for advanced usage)
- **[DA.live Documentation](https://docs.da.live/)** - Complete documentation
- **[PostMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)** - Understanding cross-origin communication

---

## Next Exercise

**Exercise 8**: Performance Optimization - You'll learn to analyze and optimize your Edge Delivery Services site for perfect Core Web Vitals and Lighthouse scores.
