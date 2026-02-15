# Exercise 5: JSON2HTML - Generate Pages from Data

**Duration**: 25 minutes

---

## Prerequisites

**Complete [SETUP.md](../SETUP.md) if not already done.**

Required:
- On your feature branch (`jsmith` - your first initial + last name)
- Local dev server running at `http://localhost:3000`
- Admin API token (instructor will provide)
- Exercises 1-4 completed

**Your Personal Workspace**: All work in `/drafts/jsmith/` (use your name: first initial + last name, lowercase)

**Verify data source exists**:

The instructor has created a **Sheet** in DA.live with future event data. Verify it exists:

1. **Open in browser**:
   ```
   https://main--nycmasterclass--cloudadoption.aem.page/future-events.json
   ```

2. **You should see**: JSON with 6 event records (Sydney, London, Bangalore, Berlin, Singapore, Dubai) including city, date, venue, highlights, images, etc.

3. **If you see 404**: Ask the instructor to publish the `/future-events` Sheet to main branch.

**Key concept**: Sheets in DA.live automatically become JSON endpoints. The Sheet at `/future-events` becomes available as `/future-events.json`.

---

## What You'll Learn

- How to generate multiple pages from a single JSON data source
- How to create Mustache templates that transform JSON into HTML
- How to configure the JSON2HTML worker service
- How to use the JSON2HTML Simulator and Admin Edit tools
- How to implement dynamic page patterns at scale

---

## Why This Matters

**The problem**: You need to create event pages for 6 cities. Each page has the same structure but different data (city, date, venue, etc.).

**Manual approach**: Create 6 pages by hand in DA.live. Time-consuming, error-prone, hard to maintain. If the layout changes, update all 6 pages.

**JSON2HTML approach**:
- Create **one** Mustache template page
- Store event data in **one** JSON file (6 records)
- Configure the JSON2HTML worker
- Worker generates all 6 pages automatically
- Update template once → all 6 pages update automatically
- Add a 7th city? Just add JSON, no new page needed

**The pattern**:
```
1. Data in JSON: /future-events.json (6 city records)
2. Template in DA.live: /templates/event-template.html (with {{city}}, {{date}}, etc.)
3. Worker configuration: Maps /events/sydney → JSON + Template → HTML
4. Result: 6 event pages, zero manual authoring
```

**Real-world use cases**:
- Event series across multiple cities
- Product detail pages (e-commerce catalogs with 1000+ SKUs)
- Speaker/author profiles (conferences with 100+ speakers)
- Blog post templates (consistent article layouts)
- Store locator pages (hundreds of locations)

---

## How JSON2HTML Works

The JSON2HTML worker is a generic Edge Delivery Services worker that transforms JSON data into HTML pages using Mustache templates.

**Architecture**:
```
1. User visits: /events/sydney
2. Worker checks config for /events/ pattern
3. Worker fetches: /future-events.json
4. Worker filters to: { "city": "Sydney", "URL": "/events/sydney", ... }
5. Worker fetches template: /templates/event-template.html
6. Worker renders: Mustache template + JSON data = HTML
7. User sees: Fully rendered event page for Sydney
```

**Key benefits**:
- **No custom code** - Hosted worker service, zero deployment
- **Branch-aware** - Test on your branch before production
- **Mustache templates** - Simple, logic-less syntax
- **Flexible** - Works with any JSON structure

**Reference**: [JSON2HTML Documentation](https://www.aem.live/developer/json2html)

---

## Understanding the Data: Future Events Sheet

The instructor has created a **Sheet in DA.live** at `/future-events` with upcoming masterclass events in 6 cities.

**Sheet in DA.live**: `/future-events` (editable spreadsheet)

**JSON endpoint**: `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json`

**Key concept**: Sheets automatically become JSON endpoints. Authors edit the Sheet, developers consume the JSON.

**Sheet structure** (what the author sees in DA.live):

| city | country | date | venue | address | description | highlights | image | registrationUrl | URL |
|------|---------|------|-------|---------|-------------|------------|-------|-----------------|-----|
| Sydney | Australia | March 15-16, 2026 | Sydney Convention Centre | ... | Join us for... | 12 expert-led sessions, 8 hands-on labs, ... | https://images.unsplash.com/... | https://events.adobe.com/sydney-2026 | /events/sydney |
| London | United Kingdom | April 20-21, 2026 | ExCeL London | ... | Experience two days... | ... | ... | ... | /events/london |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |

**JSON structure** (what the developer gets):
```json
{
  "total": 6,
  "data": [
    {
      "city": "Sydney",
      "country": "Australia",
      "date": "March 15-16, 2026",
      "venue": "Sydney Convention Centre",
      "address": "14 Darling Drive, Sydney NSW 2000",
      "description": "Join us for two days of hands-on Edge Delivery Services training in Sydney. Master the fundamentals of building blazing-fast websites with AEM.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner at Sydney Opera House, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200",
      "registrationUrl": "https://events.adobe.com/sydney-2026",
      "URL": "/events/sydney"
    },
    {
      "city": "London",
      "country": "United Kingdom",
      "date": "April 20-21, 2026",
      "venue": "ExCeL London",
      "address": "One Western Gateway, Royal Victoria Dock, London E16 1XL",
      "description": "Experience two days of cutting-edge web development training in London. Learn from Adobe's leading experts on Edge Delivery Services.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner at The Shard, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200",
      "registrationUrl": "https://events.adobe.com/london-2026",
      "URL": "/events/london"
    },
    {
      "city": "Bangalore",
      "country": "India",
      "date": "May 10-11, 2026",
      "venue": "Bangalore International Exhibition Centre",
      "address": "10th Mile, Tumkur Road, Bangalore 560073",
      "description": "Master Edge Delivery Services with hands-on training in Bangalore. Build fast, scalable websites with AEM's modern architecture.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner with local tech community, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200",
      "registrationUrl": "https://events.adobe.com/bangalore-2026",
      "URL": "/events/bangalore"
    },
    {
      "city": "Berlin",
      "country": "Germany",
      "date": "June 5-6, 2026",
      "venue": "Berlin Congress Center",
      "address": "Alexanderplatz 1, 10178 Berlin",
      "description": "Join developers from across Europe for two days of intensive EDS training in Berlin. Learn to build performance-first websites.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner at Brandenburg Gate, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200",
      "registrationUrl": "https://events.adobe.com/berlin-2026",
      "URL": "/events/berlin"
    },
    {
      "city": "Singapore",
      "country": "Singapore",
      "date": "July 12-13, 2026",
      "venue": "Marina Bay Sands Expo and Convention Centre",
      "address": "10 Bayfront Avenue, Singapore 018956",
      "description": "Experience world-class Edge Delivery Services training in Singapore. Master modern web development with Adobe's latest innovations.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner at Gardens by the Bay, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200",
      "registrationUrl": "https://events.adobe.com/singapore-2026",
      "URL": "/events/singapore"
    },
    {
      "city": "Dubai",
      "country": "United Arab Emirates",
      "date": "August 18-19, 2026",
      "venue": "Dubai World Trade Centre",
      "address": "Sheikh Zayed Road, Dubai",
      "description": "Join the premier Edge Delivery Services training event in the Middle East. Two days of intensive hands-on learning in Dubai.",
      "highlights": "12 expert-led sessions, 8 hands-on labs, Networking dinner at Burj Khalifa, Certificate of completion",
      "image": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200",
      "registrationUrl": "https://events.adobe.com/dubai-2026",
      "URL": "/events/dubai"
    }
  ]
}
```

**URL patterns**: Each event has a unique URL path in the `URL` field:
- `/events/sydney`
- `/events/london`
- `/events/bangalore`
- `/events/berlin`
- `/events/singapore`
- `/events/dubai`

**Key concept**: The JSON2HTML worker will match incoming requests (e.g., `/events/sydney`) to the correct record using the `URL` field, then render it using your Mustache template.

**Note on `highlights` field**: In the Sheet, this is stored as a comma-separated string (e.g., "12 expert-led sessions, 8 hands-on labs, Networking dinner, Certificate"). In the Mustache template, we simply output it as a paragraph: `{{highlights}}`. Mustache is logic-less, so it can't split strings into arrays.

---

## Step 1: Create Mustache Template

**In DA.live**, create page: `/drafts/jsmith/templates/event-template` (use your name)

Add this content (Mustache template with HTML):

```html
<div>
  <div>
    <picture>
      <source media="(min-width: 900px)" srcset="{{image}}?width=1200">
      <source media="(min-width: 600px)" srcset="{{image}}?width=900">
      <img src="{{image}}?width=600" alt="{{city}} skyline">
    </picture>
  </div>
  <div>
    <h1>{{city}} Masterclass 2026</h1>
    <p>{{date}}</p>
    <p><a href="{{registrationUrl}}" class="button">Register Now</a></p>
  </div>
</div>

<div>
  <h2>About This Event</h2>
  <p>{{description}}</p>
</div>

<div>
  <h2>Event Details</h2>
  <ul>
    <li><strong>Location:</strong> {{venue}}, {{city}}, {{country}}</li>
    <li><strong>Address:</strong> {{address}}</li>
    <li><strong>Date:</strong> {{date}}</li>
  </ul>
</div>

<div>
  <h2>What's Included</h2>
  <p>{{highlights}}</p>
</div>

<div>
  <p><a href="{{registrationUrl}}" class="button">Register for {{city}}</a></p>
</div>

<div class="metadata">
  <div>
    <div>
      <p>Title</p>
    </div>
    <div>
      <p>{{city}} Masterclass 2026 - Edge Delivery Services Training</p>
    </div>
  </div>
  <div>
    <div>
      <p>Description</p>
    </div>
    <div>
      <p>{{description}}</p>
    </div>
  </div>
</div>
```

**Save** the page.

**What this template does**:
- Uses Mustache syntax: `{{city}}`, `{{date}}`, `{{venue}}`, etc.
- Hero section with responsive image and CTA
- Event details section
- Highlights displayed as paragraph text
- Metadata block for SEO

**Mustache syntax reference**:
- `{{variable}}` - Outputs value
- `{{#array}}...{{/array}}` - Loops over array (when you have array data)
- `{{.}}` - Current item in loop

**Reference**: [Mustache Documentation](https://mustache.github.io/mustache.5.html)

---

## Step 2: Test Template in Simulator

Before configuring the worker, test your template with real data using the **JSON2HTML Simulator**.

**Open**: [https://tools.aem.live/tools/json2html-simulator/](https://tools.aem.live/tools/json2html-simulator/)

### Configure the Simulator:

1. **JSON Data** (left panel):
   - Fetch the real data: Open `https://main--nycmasterclass--cloudadoption.aem.page/future-events.json` in browser
   - Copy the entire JSON response
   - Paste into the "JSON Data" panel

2. **Simulator Options** (click ⚙ Options):
   - **arrayKey**: `data`
   - **pathKey**: `URL`
   - **testPath**: `/events/sydney`
   - This filters to only the Sydney event record

3. **Mustache Template** (middle panel):
   - Copy your template content from DA.live
   - Paste into the "Mustache Template" panel

4. **Click "Render"** or press `Cmd+Enter`

**You should see**: Fully rendered HTML for the Sydney event in the preview panel.

**Test other cities**: Change **testPath** to `/events/london`, `/events/bangalore`, etc. and re-render.

**Fix any issues**: If variables don't render, check spelling in JSON vs template.

**Reference**: [JSON2HTML Simulator Documentation](https://tools.aem.live/tools/json2html-simulator/)

---

## Step 3: Configure JSON2HTML Worker

Now that your template works in the simulator, configure the worker to generate pages automatically.

**Open**: [https://tools.aem.live/tools/admin-edit/](https://tools.aem.live/tools/admin-edit/)

### Configure the Admin Edit Tool:

1. **Admin URL**: Enter this exact URL (replace `jsmith` with your branch name):
   ```
   https://json2html.adobeaem.workers.dev/config/cloudadoption/nycmasterclass/jsmith
   ```

2. **Method**: Select **POST**

3. **Body**: Enter this JSON configuration (replace `jsmith` with your name in the template path):
   ```json
   [
     {
       "path": "/events/",
       "endpoint": "https://main--nycmasterclass--cloudadoption.aem.page/future-events.json",
       "arrayKey": "data",
       "pathKey": "URL",
       "template": "/drafts/jsmith/templates/event-template"
     }
   ]
   ```

4. **Authorization**: The tool will prompt for your admin token. Enter the token provided by the instructor.

5. **Click "POST"**

**You should see**: Success response (200 OK) confirming the configuration was saved.

**What this configuration does**:
- **path**: `/events/` - Worker intercepts all requests starting with `/events/`
- **endpoint**: URL to fetch JSON data
- **arrayKey**: `data` - Tells worker the events are in the `data` array
- **pathKey**: `URL` - Tells worker to match incoming path (e.g., `/events/sydney`) against the `URL` field
- **template**: Path to your Mustache template (branch-aware!)

**Key insight**: The worker is **branch-aware**. Your branch (`jsmith`) will use **your template** while main branch uses a different template. Zero conflicts!

---

## Step 4: Preview Generated Pages

Now test that the worker is generating pages from your template!

**Open in browser** (replace `jsmith` with your branch name):
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/events/sydney
```

**You should see**:
- Full event page for Sydney rendered from your template
- Hero image, title, date, registration button
- Event details, highlights list
- All data populated from JSON

**Test all 6 cities**:
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/london`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/bangalore`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/berlin`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/singapore`
- `https://jsmith--nycmasterclass--cloudadoption.aem.page/events/dubai`

**All 6 pages work!** No manual page creation needed - just JSON data + template.

**Debug if needed**:
- If you see "Not Found", check your config path pattern
- If template doesn't render, verify template path in config
- If data is missing, check `arrayKey` and `pathKey` settings
- View browser DevTools console for errors

---

## Step 5: Optional - Create Events Landing Page

To make the events discoverable, create a landing page that lists all 6 cities.

**In DA.live**, create page: `/drafts/jsmith/future-events` (use your name)

```
# Upcoming Masterclass Events

Join us in 2026 for Edge Delivery Services training in cities worldwide.

| Page List |
|-----------|
| / |
| 6 |
```

**What you're doing**: Using the Page List block from Exercise 4, but instead of filtering by path, showing all events.

**Alternative approach**: Create a dynamic cards block that fetches `future-events.json` and renders cards (similar to Exercise 3).

**Open**: `http://localhost:3000/drafts/jsmith/future-events`

**You should see**: 6 event cards (if you have page-list block, or implement similar pattern).

---

## Step 6: Optional - Add Custom Styling

If you want to customize the event page styling, create CSS:

**File**: `styles/event-template.css`

```css
/* Event template specific styles */
.event-hero {
  position: relative;
  min-height: 400px;
  display: flex;
  align-items: flex-end;
  padding: 40px 20px;
}

.event-hero img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.event-details ul {
  list-style: none;
  padding: 0;
  margin: 24px 0;
}

.event-details li {
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.event-details li:last-child {
  border-bottom: none;
}

.event-highlights ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 0;
  list-style: none;
}

.event-highlights li {
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

@media (max-width: 600px) {
  .event-hero {
    min-height: 300px;
  }

  .event-highlights ul {
    grid-template-columns: 1fr;
  }
}
```

**To apply**: Add a `<link>` to your template or load via site CSS.

**Note**: The worker generates semantic HTML that's already styled by your site's global styles. Custom styles are optional!

---

## Step 7: Commit Your Changes

Since the template is authored in DA.live (not local code), you only need to commit if you added custom CSS or other code changes.

**If you added custom CSS**:

```bash
# Run linting
npm run lint

# Add changes
git add styles/event-template.css

# Commit
git commit -m "feat: add custom styling for JSON2HTML event template"

# Push
git push origin jsmith
```

Replace `jsmith` with your branch name.

**If you only created the template in DA.live**: No commit needed! The template is stored in DA.live, and the worker config is stored in the worker service.


---

## Real-World Applications

**Use Case 1: Multi-City Event Series** (this exercise!)
- **Scenario**: Masterclass events in 6+ cities
- **Data**: Single JSON with all event details
- **Template**: One Mustache template for all cities
- **Result**: Add new city → just update JSON, page auto-generates
- **Scale**: Hundreds of events without manual authoring

**Use Case 2: Product Catalogs**
- **Scenario**: E-commerce site with 1000+ products
- **Data**: Products JSON or API (SKU, price, specs, images)
- **Template**: Product detail page template
- **URL Pattern**: `/products/laptop-model-123`
- **Result**: 1 template → 1000+ product pages

**Use Case 3: Speaker/Author Profiles**
- **Scenario**: Conference with 100+ speakers
- **Data**: Speakers JSON (name, bio, photo, sessions)
- **Template**: Speaker profile template
- **URL Pattern**: `/speakers/john-doe`
- **Result**: Dynamic speaker pages from central data

**Use Case 4: Blog/Article Archives**
- **Scenario**: News site with thousands of articles
- **Data**: Query-index.json + article JSON
- **Template**: Consistent article layout
- **URL Pattern**: `/blog/2026/01/article-title`
- **Result**: Uniform layout across all articles

**Use Case 5: Store Locator**
- **Scenario**: Retail chain with 500+ locations
- **Data**: Locations JSON (address, hours, services)
- **Template**: Store page template
- **URL Pattern**: `/stores/new-york-manhattan`
- **Result**: Individual pages for each store

**Common benefits**:
- **One template, unlimited pages**
- **Update template once → all pages update**
- **Add data → page auto-generates**
- **No custom deployment - hosted worker**
- **Branch-aware for safe testing**

---

## Advanced Patterns

### URL Rewriting (Production)

For cleaner URLs in production, use URL rewriting:

**Current (works in exercise)**: `/events/sydney`

**How it works**: Worker intercepts `/events/*` paths and applies template

**For custom patterns**: Configure regex in worker config. See [JSON2HTML Documentation](https://www.aem.live/developer/json2html) for advanced regex patterns.

### Dynamic Data Sources

The `endpoint` can be:
- Static JSON file (like this exercise)
- Edge Delivery Sheet JSON (`.json` from any Sheet)
- External API (with authentication headers)
- Worker-transformed data (pre-process JSON)

**Example with external API**:
```json
{
  "endpoint": "https://api.example.com/events/{{id}}.json",
  "headers": {
    "X-API-Key": "your-key-here"
  }
}
```

### Multiple Templates

You can configure different templates for different URL patterns:

```json
[
  {
    "path": "/events/",
    "endpoint": "...",
    "template": "/templates/event-template"
  },
  {
    "path": "/sessions/",
    "endpoint": "...",
    "template": "/templates/session-template"
  }
]
```

---

## Key Takeaways

- **JSON2HTML worker** transforms JSON data into HTML pages using Mustache templates
- **One template → unlimited pages** - Add data to JSON, pages generate automatically
- **Mustache syntax** is logic-less and simple: `{{variable}}`, `{{#array}}...{{/array}}`
- **Branch-aware** - Test on your branch without affecting production
- **Hosted service** - No custom deployment or code needed
- **JSON2HTML Simulator** - Test templates before deploying
- **Admin Edit tool** - Configure worker via web UI (no curl needed)
- **Scale effortlessly** - 6 events or 600, same template

**The pattern**:
1. Data in JSON (Sheet, API, or file)
2. Template in DA.live (Mustache syntax)
3. Worker config (path pattern, endpoint, template)
4. Pages generate automatically

**When to use**:
- Multiple pages with same structure but different data
- Data-driven content (products, events, profiles)
- Content that changes frequently
- Need to scale beyond manual authoring

---

## Verification Checklist

- [ ] **Created Mustache template** in DA.live at `/drafts/jsmith/templates/event-template`
- [ ] **Tested in simulator** with real `future-events.json` data
- [ ] **Configured worker** using Admin Edit tool with correct branch
- [ ] **All 6 event pages render** (`/events/sydney`, `/events/london`, etc.)
- [ ] **Data populates correctly** (city, date, venue, highlights)
- [ ] **Images display** properly
- [ ] **Registration buttons** link to correct URLs
- [ ] **Understand Mustache syntax** (`{{variable}}`, `{{#array}}`, `{{.}}`)
- [ ] **Understand worker config** (path, endpoint, arrayKey, pathKey, template)
- [ ] **Branch-aware deployment** - Your branch uses your template
- [ ] **Optional: Created events landing page** with cards
- [ ] **Optional: Added custom CSS** and committed changes

---

## References

- **[JSON2HTML Documentation](https://www.aem.live/developer/json2html)** - Complete worker documentation
- **[JSON2HTML Simulator](https://tools.aem.live/tools/json2html-simulator/)** - Test templates with live data
- **[Admin Edit Tool](https://tools.aem.live/tools/admin-edit/)** - Configure worker settings
- **[Mustache Documentation](https://mustache.github.io/mustache.5.html)** - Template syntax reference
- **[EDS Indexing](https://www.aem.live/developer/indexing)** - Using query-index.json as data source

---

## Troubleshooting

**Pages show "Not Found"**:
- Verify your worker config path pattern matches URL
- Check that you're using the correct branch URL
- Ensure config was POSTed successfully (check response)

**Template doesn't render**:
- Verify template path in config matches DA.live path
- Check for typos in Mustache variable names
- Test in simulator first to isolate issues

**Data missing or wrong**:
- Verify `arrayKey` points to correct array in JSON
- Verify `pathKey` matches the field name exactly
- Check that `URL` values in JSON match request paths

**"401 Unauthorized"**:
- Verify admin token is correct
- Token must have permissions for config endpoint

**Changes don't appear**:
- Worker config is cached briefly - wait 1-2 minutes
- Try hard refresh (Cmd+Shift+R or Ctrl+Shift+R)
- Check you're on correct branch URL

---

## Next Exercise

**Exercise 6**: Workers and API Integration - You'll learn how to use Cloudflare Workers to transform data, secure APIs, and add custom logic to your Edge Delivery Services site.
