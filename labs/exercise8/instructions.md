# Exercise 8: Repoless Multi-Site Setup

**Duration**: 30 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Exercises 1-7 completed
- Access to DA.live (you should already be authoring there)
- Logged into AEM Sidekick extension (for Site Admin tool auth)

**Your Personal Workspace**: All work in your own site: `cloudadoption/jsmith-mc` (use your name: first initial + last name, lowercase)

---

## What You'll Learn

- How repoless architecture works in Edge Delivery Services
- How to share code across multiple sites (one codebase, many sites)
- How to use the Site Admin tool to configure sites
- How to create your own DA.live project as a new site
- How Configuration Service manages code and content separation
- How to verify code is loading from a shared repository

---

## Why This Matters

**The scenario**: NYC Masterclass is successful. You need to launch personal regional events or client sites with the same functionality.

**The problem**: Do you duplicate the entire codebase for each site? Fork the repo? Copy all blocks?

**The repoless solution**:
- **One code repository** (blocks, scripts, styles) - `cloudadoption/nycmasterclass`
- **Multiple sites** with different content - Each person's site in DA.live
- **Configuration Service** manages which code repo each site uses
- **Code updates** to `nycmasterclass` apply to all sites automatically
- **Zero code duplication** - Launch new sites in minutes

**Benefits**:
- Maintain code once -> all sites get updates instantly
- Launch new sites in minutes (not hours or days)
- Consistent functionality and quality across sites
- Bug fixes apply everywhere automatically
- Scale from 1 to 100+ sites effortlessly

---

## Understanding Repoless

### Traditional Model (Without Repoless)
```
NYC Masterclass
├── GitHub: cloudadoption/nycmasterclass (code)
└── DA.live: cloudadoption/nycmasterclass (content)

Boston Masterclass
├── GitHub: cloudadoption/boston-mc (code - DUPLICATED!)
└── DA.live: cloudadoption/boston-mc (content)

Chicago Masterclass  
├── GitHub: cloudadoption/chicago-mc (code - DUPLICATED!)
└── DA.live: cloudadoption/chicago-mc (content)
```

**Problem**: Update the hero block? Must change 3 GitHub repositories. Bug fix? Deploy to 3 places.

### Repoless Model (With Configuration Service)
```
CODE (ONE place)
GitHub: cloudadoption/nycmasterclass
├── blocks/
├── scripts/
└── styles/

CONTENT (MANY places)
DA.live Projects (each uses nycmasterclass code):
├── cloudadoption/nycmasterclass (NYC content)
├── cloudadoption/boston-mc (Boston content)
├── cloudadoption/chicago-mc (Chicago content)
└── cloudadoption/jsmith-mc (YOUR content)
```

**Solution**: Update hero block once in `nycmasterclass` -> all 4 sites get it instantly.

**Reference**: [Repoless Architecture](https://www.aem.live/docs/repoless)

---

## How It Works

### The Configuration Service

Each site in DA.live can specify:

1. **Content Source**: Where content lives (always the DA.live project itself)
2. **Code Source**: Where code lives (can point to a different GitHub repo)
3. **Site Settings**: Permissions, custom configuration

**Example**: Your site `cloudadoption/jsmith-mc`
- Content from: `cloudadoption/jsmith-mc` in DA.live (YOUR pages)
- Code from: `cloudadoption/nycmasterclass` in GitHub (SHARED blocks/scripts)

### What Gets Loaded From Where

When someone visits `https://main--jsmith-mc--cloudadoption.aem.page/schedule`:

1. EDS checks `jsmith-mc` configuration -> sees code source is `nycmasterclass`
2. Gets **content** (schedule.html) from `cloudadoption/jsmith-mc` in DA.live
3. Gets **code** (hero.js, hero.css, scripts.js) from `cloudadoption/nycmasterclass` in GitHub
4. Combines them -> your page with your content, shared functionality

**Reference**: [Configuration Service Setup](https://www.aem.live/docs/config-service-setup)

---

## Step 1: Create Your DA.live Project

You'll create your own DA.live project for your personal masterclass site.

1. Open DA.live: `https://da.live/`
2. Click "+" or "New Project"
3. Create project:
   - **Org**: `cloudadoption` (should be pre-filled if you have access)
   - **Project Name**: `jsmith-mc` (your first initial + last name + `-mc`)
   - Example: John Smith -> `jsmith-mc`, Sarah Johnson -> `sjohnson-mc`

4. Click "Create"

**Verification**: You should now see `cloudadoption/jsmith-mc` in your DA.live projects list.

---

## Step 2: Create Initial Content

Create a homepage for your site to prove content independence:

1. In DA.live, open your project (`cloudadoption/jsmith-mc`)
2. Create a new page: `index.html`
3. Add content (customize with your name/city):

```html
<div>
  <div>
    <picture>
      <source type="image/webp" srcset="https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=1200&fm=webp" media="(min-width: 600px)">
      <source type="image/webp" srcset="https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800&fm=webp">
      <img src="https://images.unsplash.com/photo-1551818255-e6e10975bc17?w=800" alt="Tech Conference">
    </picture>
  </div>
  <div>
    <h1>San Francisco Masterclass</h1>
    <p>May 2026 • Your City Here</p>
  </div>
</div>
```

4. Add a Metadata block at the end:

```html
<div class="metadata">
  <div>
    <div>Title</div>
    <div>SF Masterclass 2026</div>
  </div>
  <div>
    <div>Description</div>
    <div>Edge Delivery Services training in San Francisco</div>
  </div>
</div>
```

5. **Preview** the page in DA.live

**At this point**: You have content, but no code (blocks won't work yet).

---

## Step 3: Configure Code Source (The Repoless Magic!)

Now connect your site to the shared `nycmasterclass` codebase:

1. Open **Site Admin Tool**: `https://tools.aem.live/tools/site-admin/index.html`

2. **IMPORTANT**: You must be logged in via AEM Sidekick extension first (should already be from earlier exercises)

3. In Site Admin:
   - **Organization**: `cloudadoption`
   - **Repository**: `jsmith-mc` (your project name)
   - Click "Load Config"

4. If no config exists, you'll see an empty form or option to add site

5. Configure the code source:
   - Look for **Code Source** or **Code** section
   - **Code Owner**: `cloudadoption`
   - **Code Repository**: `nycmasterclass`
   - **Code Branch**: `main` (or leave empty for default)

6. **Save** the configuration

**What you just did**: Told the Configuration Service that `jsmith-mc` should load all code (blocks, scripts, styles) from `cloudadoption/nycmasterclass` repository.

---

## Step 4: Verify Repoless is Working

Test that your site loads code from the shared `nycmasterclass` repository:

1. Open your site: `https://main--jsmith-mc--cloudadoption.aem.page/`

2. Open browser DevTools (F12) -> Network tab

3. Refresh the page

4. Filter by "JS" or "CSS" and look at the file URLs

**You should see**:
```
https://main--nycmasterclass--cloudadoption.aem.page/blocks/hero/hero.js
https://main--nycmasterclass--cloudadoption.aem.page/scripts/scripts.js  
https://main--nycmasterclass--cloudadoption.aem.page/styles/styles.css
```

**KEY OBSERVATION**: URLs say `nycmasterclass`, NOT `jsmith-mc`!

**This proves**:
- Your **content** comes from `cloudadoption/jsmith-mc` (your DA.live project)
- Your **code** comes from `cloudadoption/nycmasterclass` (shared GitHub repo)
- **Repoless is working!**

---

## Step 5: Prove Content Independence

Create another page with your own content to prove sites are independent:

1. In DA.live (`cloudadoption/jsmith-mc`), create `schedule.html`

2. Add a simple table block with YOUR city's schedule:

```html
<div class="section schedule">
  <h1>My City Schedule</h1>
  
  <table>
    <tbody>
      <tr>
        <td>9:15 AM</td>
        <td><a href="/sessions/getting-started">Getting Started with EDS</a></td>
        <td>Jane Doe</td>
      </tr>
      <tr>
        <td>10:30 AM</td>
        <td><a href="/sessions/blocks">Building Blocks</a></td>
        <td>John Smith</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="metadata">
  <div>
    <div>Title</div>
    <div>My City Schedule</div>
  </div>
</div>
```

3. Add **Section Metadata** (between table and metadata block):

```html
---
Section Metadata

Style
schedule
---
```

4. **Preview**: `https://main--jsmith-mc--cloudadoption.aem.page/schedule`

**What you should see**:
- Your custom schedule content (different from NYC)
- Same table styling as NYC site (from shared CSS)
- Links styled as text, not buttons (from shared `.section.schedule` CSS)
- **Same functionality, different content!**

**Compare with NYC schedule**:
- Visit: `https://main--nycmasterclass--cloudadoption.aem.page/schedule`
- Notice: Different content (NYC dates vs yours), same code (styling, blocks)

---

## Step 6: Make a Content Change (Prove Independence)

Update your homepage to prove content independence:

1. In DA.live, edit `index.html` in `cloudadoption/jsmith-mc`

2. Change the heading and dates:

```html
<div>
  <div>
    <picture>
      <source type="image/webp" srcset="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&fm=webp" media="(min-width: 600px)">
      <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800" alt="Your City Skyline">
    </picture>
  </div>
  <div>
    <h1>Austin Masterclass</h1>
    <p>August 2026 • Austin, Texas</p>
  </div>
</div>
```

3. **Preview** and **Publish**

4. Verify:
   - Your site shows Austin
   - NYC site still shows NYC
   - Both sites use same blocks, styles, scripts

**This proves**: Each site's content is completely independent while sharing all code.

---

## Step 7: Explore Other Participants' Sites

Ask other participants to share their site URLs. Compare:

- Site 1: `https://main--jsmith-mc--cloudadoption.aem.page/`
- Site 2: `https://main--agarcia-mc--cloudadoption.aem.page/`
- Site 3: `https://main--kwang-mc--cloudadoption.aem.page/`

**What you'll notice**:
- All sites have different content (cities, dates, schedules)
- All sites have identical styling (hero, navigation, footer)
- All sites use the same blocks (same functionality)
- All sites load code from `nycmasterclass` (check DevTools Network tab)

**Result**: 20+ unique sites from one codebase!

---

## Step 8: Explore Configuration Tools

**Site Admin Tool**:

Visit: `https://tools.aem.live/tools/site-admin/index.html`

Search for `cloudadoption` and explore:
- See all participants' sites
- Notice they all use code from `nycmasterclass`
- See different content sources for each

**Other Configuration Tools**:

Visit: `https://tools.aem.live`

Explore additional tools:
- **Admin Edit**: Modify site configuration (headers, metadata, redirects)
- **Bulk Operations**: Manage multiple sites at once
- **Permissions**: Control access per site

**What's configurable without code changes**:
- Content source (DA.live project)
- Code source (GitHub repo)
- Access permissions (who can edit)
- Headers and redirects
- Metadata defaults
- CDN settings

**What requires code changes**:
- Themes (colors, fonts) - requires CSS changes
- Block functionality - requires JS changes
- New features - requires new blocks/scripts

---

## Optional: Add Site-Specific Configuration

For advanced participants, create site-specific config to customize behavior:

1. In DA.live (`cloudadoption/jsmith-mc`), create `config.json` sheet:

| key      | value  |
|----------|--------|
| site     | austin |
| city     | Austin |
| year     | 2026   |
| location | Austin Convention Center |
| primaryColor | #FF6B35 |

2. Access config in blocks (example):

```javascript
// In any block
const response = await fetch('/config.json');
const configData = await response.json();
const config = {};
configData.data.forEach(row => {
  config[row.key] = row.value;
});

// Use config
console.log(config.city); // "Austin"
```

**Key insight**: Each site's `/config.json` comes from its own DA.live project, so same code reads different data.

---

## Key Benefits of Repoless

**For developers**:
- Fix bug once -> all sites get fix instantly
- Add feature once -> all sites get feature immediately
- One codebase to maintain (not 10 or 100)
- Centralized testing and quality control
- No code duplication or version drift

**For content authors**:
- Each site has own DA.live project (zero conflicts)
- No code complexity (pure content authoring)
- Full editorial control per site
- Site-specific branding via config

**For organizations**:
- Launch new sites in minutes (not days or weeks)
- Consistent functionality and quality across all sites
- Reduced maintenance overhead (1x effort, Nx sites)
- Scale to hundreds or thousands of sites effortlessly

---

## Real-World Applications

**Use Case 1: Multi-Region Events (Like This Masterclass!)**
- Code: Event site template (blocks, navigation, forms)
- Sites: NYC, Boston, Austin, London, Tokyo, Dubai
- Config: City, venue, dates, colors per site
- Content: Local speakers, sessions, sponsors per site
- Result: Launch 6 events in 6 cities in 1 hour

**Use Case 2: Multi-Brand E-Commerce**
- Code: E-commerce platform (product display, cart, checkout)
- Sites: Brand A, Brand B, Brand C (3 fashion brands)
- Config: Colors, logo, domain, currency per brand
- Content: Products, categories, campaigns per brand
- Result: Consistent shopping experience, brand-specific identity

**Use Case 3: Department Microsites**
- Code: Company template (hero, cards, forms)
- Sites: Marketing, Sales, Engineering, HR, Legal
- Config: Navigation, colors, contact info per department
- Content: Department-specific pages, resources, team
- Result: Cohesive company presence, departmental autonomy

**Use Case 4: Franchise Network**
- Code: Restaurant template (menu, locations, reservations)
- Sites: 500+ franchise locations (each has own site)
- Config: Address, hours, phone, menu prices per location
- Content: Local photos, events, staff bios per location
- Result: Consistent brand experience, local customization at scale

---

## Key Takeaways

- **Repoless** separates code from content and configuration
- **One code repository** can serve unlimited sites
- **Configuration Service** manages which code each site uses
- **Sites created** via Site Admin tool in minutes
- **Each site** has own content source in DA.live
- **Code updates** apply to all sites automatically
- **Scale** from 1 site to 1000+ sites with same effort
- **Launch** new sites without forking, duplicating, or managing separate repos

---

## Verification Checklist

- [ ] Created your own DA.live project (`cloudadoption/jsmith-mc`)
- [ ] Created initial content (`index.html` with Hero block)
- [ ] Configured code source in Site Admin tool (point to `nycmasterclass`)
- [ ] Verified code loading from `nycmasterclass` (DevTools Network tab)
- [ ] Created custom schedule page (different content, same styling)
- [ ] Made content changes (updated city, dates)
- [ ] Compared your site with other participants' sites
- [ ] Understand how same code produces different sites
- [ ] Explored Site Admin and configuration tools
- [ ] Know what's configurable vs what requires code changes

---

## References

- [Repoless Architecture](https://www.aem.live/docs/repoless)
- [Configuration Service Setup](https://www.aem.live/docs/config-service-setup)
- [Admin API](https://www.aem.live/docs/admin.html)
- [Tools Dashboard](https://tools.aem.live)

---

## Congratulations!

You've completed all 8 exercises of the NYC Masterclass 2026 lab.

You now know how to:
- Author content in DA.live
- Build blocks with variations
- Fetch data from external sources
- Use query index with auto-blocking
- Generate pages from JSON templates
- Handle form submissions via Workers
- Build DA.live plugins for content insertion
- Architect multi-site solutions with shared code

**Next steps**:
- Review your work
- Run `npm run lint` one final time
- Create pull request with before/after URLs
- Share Lighthouse scores (target: 100)

Thank you for participating in NYC Masterclass 2026!
