# NYC Masterclass 2026 - Lab Guide

**Duration**: 3 hours 50 minutes (including 15-minute break)

**Theme**: Build pages and features for a Masterclass event series that can scale to future meetup sites.

---

## Lab Narrative

Welcome to the NYC Masterclass 2026 hands-on lab. Through practical exercises, you'll learn how to build fast, maintainable websites with Adobe Edge Delivery Services (EDS) and DA.live.

**The journey**:
1. Start as an author creating content
2. Become a developer building blocks
3. Integrate dynamic data from external sources
4. Scale to enterprise multi-site architecture

**What makes EDS different**:
- Document-based authoring (Word/Google Docs)
- No build steps, no frameworks
- 100 Lighthouse scores by default
- Microservices architecture
- API-first approach

By the end of this lab, you'll understand how to build production-ready websites that are fast, maintainable, and author-friendly.

---

## Before You Begin

**Complete setup**: [SETUP.md](SETUP.md) - Git, development environment, access verification

**Your environment**:
- Repository: https://github.com/cloudadoption/nycmasterclass
- Branch: `jsmith` (your first initial + last name)
- Local: http://localhost:3000
- Preview: https://jsmith--nycmasterclass--cloudadoption.aem.page/
- Live: https://jsmith--nycmasterclass--cloudadoption.aem.live/

---

## Session 1: Core Concepts (2 hours 5 minutes)

**Introduction** (15 mins): EDS overview, architecture, lab objectives

**Exercise 1** (20 mins): [Authoring Your First Page](exercise1/instructions.md)

**What you'll learn**:
- Document semantics and block structure
- DA.live authoring workflow
- Preview and publish pipeline
- Inspecting content in multiple formats (.md, .plain.html, View document source)

**What you'll build**:
- Session or Lab page with Hero block and metadata
- Understanding how sections and blocks are structured
- Personal workspace setup (jsmith naming convention)

**Key takeaway**: Understanding document semantics is fundamental. Inspect content in different formats to see how EDS transforms authored content into rendered HTML.

---

**Exercise 2** (20 mins): [Block Development - Simple Variations](exercise2/instructions.md)

**What you'll learn**:
- Block decoration lifecycle
- Implementing block variations (eyebrow, stacked)
- Mobile-first responsive CSS
- CSS scoping for blocks

**What you'll build**:
- Eyebrow variation for Cards block (adds label above content)
- Stacked variation for Cards block (centered single column)

**Key takeaway**: One block codebase can support multiple presentations through variations. Authors choose the variation they need.

---

**Exercise 3** (25 mins): [Dynamic Cards with Data Sources](exercise3/instructions.md)

**What you'll learn**:
- How Sheets convert to JSON endpoints
- Fetching data from external sources
- Async/await patterns and error handling
- Safe personal data approach to avoid conflicts

**What you'll build**:
- Dynamic Cards block that fetches speaker data from your personal workspace
- Copy speakers.json to /drafts/jsmith/ and add your own data
- Loading and error states
- Populate the /speakers page

**Key takeaway**: Dynamic blocks fetch data instead of decorating authored content. Working with personal data in drafts prevents conflicts with other participants.

---

**Exercise 4** (20 mins): [Page List with Query Index](exercise4/instructions.md)

**What you'll learn**:
- How query index works in EDS
- Custom metadata indexing with helix-query.yaml
- Manual block configuration with data attributes
- Filtering and sorting by metadata fields

**What you'll build**:
- Page List block that displays pages from query-index.json
- Manual block configuration (data-path, data-category, data-limit)
- Display speaker and instructor metadata from indexed pages

**Key takeaway**: Query index enables content discovery across your site. Index custom metadata to power dynamic page lists and filters.

---

**Exercise 5** (25 mins): [JSON2HTML - Dynamic Pages](exercise5/instructions.md)

**What you'll learn**:
- JSON2HTML worker service for dynamic page generation
- Creating Mustache templates for repeatable content
- Configuring JSON2HTML via Admin Edit tool
- Testing templates with JSON2HTML Simulator

**What you'll build**:
- Multi-city event pages from future-events.json Sheet
- Mustache template in DA.live
- JSON2HTML worker configuration
- Dynamic pages for Sydney, London, Bangalore, Berlin, Singapore, Dubai

**Key takeaway**: JSON2HTML worker transforms JSON data into HTML pages via templates. One Sheet + one template = unlimited event pages.

**Break** (15 mins)

---

## Session 2: Advanced Topics (1 hour 30 minutes)

**Exercise 6** (20 mins): [Form Submissions to Slack](exercise6/instructions.md)

**What you'll learn**:
- Building forms in EDS blocks
- Handling form submissions with JavaScript
- Worker middleware for external integrations
- Providing user feedback during async operations

**What you'll build**:
- Feedback form block with client-side validation
- Integration with Cloudflare Worker
- Slack webhook connection to post submissions

**Key takeaway**: Workers provide secure middleware for forms. Keep API keys server-side, validate data, integrate with external services.

---

**Exercise 7** (30 mins): [DA Plugin Development](exercise7/instructions.md)

**What you'll learn**:
- How DA.live plugins extend authoring capabilities
- Plugin architecture and API
- Installing and testing plugins
- Interacting with document content programmatically

**What you'll build**:
- Metadata Generator plugin
- Custom toolbar button
- Auto-generation of description and tags from content

**Key takeaway**: Plugins extend DA.live with custom functionality. Automate repetitive tasks, enforce standards, integrate with external systems.

---

**Exercise 8** (30 mins): [Repoless Multi-Site Setup](exercise8/instructions.md)

**What you'll learn**:
- Repoless architecture in EDS
- Sharing code across multiple sites
- Using Site Admin tool to configure code sources
- Verifying repoless setup with DevTools

**What you'll build**:
- Your own DA.live project (cloudadoption/jsmith-mc)
- Configure code source to point to shared nycmasterclass codebase
- Create custom content pages with shared styling
- Prove code independence using browser DevTools

**Key takeaway**: Repoless enables launching unlimited sites with shared code. Create your own site in minutes, leverage existing codebase, maintain content independence.

---

**Go-Live Discussion** (10 mins): Production readiness checklist

---

## Exercise Flow

Each exercise builds on previous concepts:

**Exercises 1-2**: Foundation
- Author perspective -> Developer perspective
- Static content -> Decorated blocks

**Exercises 3-4**: Data Integration
- External data (Sheets/personal workspace) -> Internal data (query index)
- API-first architecture in practice
- Manual configuration -> Metadata-driven display

**Exercise 5**: Content Scale
- Manual pages -> Worker-generated pages
- JSON2HTML service: Data + Mustache templates = Unlimited pages

**Exercises 6-7**: Real-World Integrations
- Output (Forms -> Slack) + Input (Widgets -> Pages)

**Exercise 8**: Enterprise Scale
- Single site -> Multi-site architecture (hands-on repoless setup)

---

## Key Concepts

**Separation of Concerns**:
- DA.live = Authoring
- EDS = Delivery
- Workers = Middleware

**API-First**:
- Every resource has a JSON representation
- DA.live API for content management
- EDS Admin API for preview/publish

**Performance by Default**:
- No frameworks, vanilla JavaScript
- Automatic image optimization
- Progressive loading (eager/lazy/delayed)

**Author-Friendly**:
- Document-based authoring
- Blocks for reusable components
- Metadata for SEO control

---

## Resources

**Documentation**:
- [AEM.live Docs](https://www.aem.live/)
- [DA.live Docs](https://docs.da.live/)
- [Developer Tutorial](https://www.aem.live/developer/tutorial)
- [Indexing Reference](https://www.aem.live/docs/indexing-reference)
- [JSON2HTML](https://www.aem.live/developer/json2html)
- [Integrations](https://www.aem.live/developer/integrations)
- [Repoless](https://www.aem.live/docs/repoless)

**Tools**:
- [EDS Admin Tools](https://tools.aem.live/)
- [Index Admin](https://tools.aem.live/tools/index-admin)
- [Site Admin](https://tools.aem.live/tools/site-admin)
- [JSON2HTML Simulator](https://tools.aem.live/tools/json2html)

**APIs**:
- [DA.live API](https://docs.da.live/developers/api)
- [EDS Admin API](https://www.aem.live/docs/admin.html)

---

## Troubleshooting

**Dev server issues**: See [SETUP.md](SETUP.md)
**Permission errors**: Verify IMS group membership, re-login to DA.live
**Pages not indexing**: Check published to `.aem.live`, wait 5-10 minutes
**Blocks not loading**: Check browser console, verify file paths

---

## After the Lab

- Build your own EDS project
- Explore [Block Collection](https://www.aem.live/developer/block-collection)
- Join [Discord Community](https://discord.gg/adobe-aem)
- Review [Go-Live Checklist](https://www.aem.live/docs/go-live-checklist)
