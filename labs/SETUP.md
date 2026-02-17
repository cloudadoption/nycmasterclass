# Lab Setup Instructions

Complete these steps before starting Exercise 1.

---

## Prerequisites

- Git installed
- Node.js v18 or higher
- Code editor (VS Code recommended)
- Web browser (Chrome/Edge recommended)

---

## Step 1: Clone Repository

```bash
git clone https://github.com/cloudadoption/nycmasterclass.git
cd nycmasterclass
```

---

## Step 2: Create Feature Branch

Use first initial + last name (e.g., John Smith = `jsmith`)

```bash
git checkout -b jsmith
```

**Important**: Use lowercase, no spaces or special characters.

---

## Step 3: Install AEM CLI

```bash
npm install -g @adobe/aem-cli
```

Verify:
```bash
aem --version
```

Expected output: Version number (e.g., `15.x.x`)

---

## Step 4: Install Dependencies

```bash
npm install
```

This installs ESLint, Stylelint, and other dev dependencies.

---

## Step 5: Run Linting

Before starting development, verify linting works:

```bash
npm run lint
```

Expected output: No errors (warnings are OK for boilerplate)

**What this checks**:
- ESLint (Airbnb JavaScript style)
- Stylelint (CSS standards)

**Important**: Never commit code with linting errors. Run `npm run lint` before every commit.

---

## Step 6: Start Development Server

```bash
aem up
```

The server starts at: http://localhost:3000

**Keep this running** throughout the lab. Open a new terminal for Git commands.

**Verify**: Open http://localhost:3000 - you should see the boilerplate homepage.

---

## Step 7: Verify Your Branch URLs

Your preview and live URLs use your branch name:

**Pattern**:
- Preview: `https://{branch}--{repo}--{owner}.aem.page/`
- Live: `https://{branch}--{repo}--{owner}.aem.live/`

**Your URLs** (replace `jsmith` with your branch):
- Preview: https://jsmith--nycmasterclass--cloudadoption.aem.page/
- Live: https://jsmith--nycmasterclass--cloudadoption.aem.live/

**Main branch** (reference only):
- Preview: https://main--nycmasterclass--cloudadoption.aem.page/
- Live: https://main--nycmasterclass--cloudadoption.aem.live/

---

## Step 8: Verify DA.live Access

1. Go to https://da.live/#/cloudadoption/nycmasterclass
2. You should see the project and folder structure
3. Navigate to `/drafts/<your-name>/`
4. You should be able to create/edit pages

**If you cannot access**:
- Verify you're logged in with your Adobe IMS account
- Check IMS group membership: `nycmasterclass2026`
- Ask instructor to verify permissions

---

## Step 9: Verify EDS Permissions

You should have `publish` role which includes:
- `preview:read`, `preview:write` (access to `.aem.page`)
- `live:write` (publish to `.aem.live`)

**Test**: Try publishing any page from DA.live. If successful, permissions are correct.

**If publish fails**: Ask instructor to verify EDS Admin API permissions.

---

## Git Workflow

### During exercises:

After completing each exercise:

```bash
# Run linting first (must pass with no errors)
npm run lint

# Add your changes
git add blocks/block-name/

# Commit with conventional commit message
git commit -m "feat: add block-name block"

# Push to your branch
git push origin jsmith
```

Replace `jsmith` with your branch name.

### Pull latest changes:

```bash
git pull origin main
```

Do this before starting new exercises if instructor made updates.

---

## Creating a Pull Request

At the end of the lab, you'll create a PR to merge your work to main.

### PR Requirements

1. **No linting errors**: Run `npm run lint` - must be clean
2. **Test URLs**: Include before/after links showing your changes
3. **Lighthouse scores**: 100 on both mobile and desktop

### Steps to Create PR

**1. Verify linting**:
```bash
npm run lint
```

Fix any errors before proceeding.

**2. Test a page with your changes**:

Pick a page that demonstrates your work (e.g., `/drafts/<your-name>/sessions` from Exercise 4).

**3. Run PageSpeed Insights**:

Test both mobile and desktop:
```
https://developers.google.com/speed/pagespeed/insights/?url=https://jsmith--nycmasterclass--cloudadoption.aem.page/drafts/<your-name>/sessions
```

Replace `jsmith` and `<your-name>` with your values.

**Target**: Green scores (ideally 100) for both mobile and desktop.

**If scores are low**:
- Optimize images
- Remove unused JavaScript
- Check for render-blocking resources
- Ask instructor for help

**4. Create PR on GitHub**:

Go to: https://github.com/cloudadoption/nycmasterclass/pulls

Click "New Pull Request"

**Base**: `main` ← **Compare**: `jsmith` (your branch)

**PR Description Template**:
```
## Summary
Added blocks from lab exercises: page-list, dynamic-cards, etc.

## Test URLs

**Before** (main branch):
https://main--nycmasterclass--cloudadoption.aem.page/

**After** (my branch):
https://jsmith--nycmasterclass--cloudadoption.aem.page/drafts/<your-name>/sessions

## Lighthouse Scores

- Mobile: 100
- Desktop: 100

Screenshot: [attach screenshot of PSI results]

## Changes
- Added page-list block (Exercise 4)
- Added dynamic-cards block (Exercise 3)
- Added registration-form block (Exercise 6)
```

Replace `jsmith` and URLs with your actual values.

**5. Request Review**:

Assign the instructor as a reviewer.

**Important**: Only the PR author (you) should merge after approval. Never merge someone else's PR without asking.

**Reference**: [Development & Collaboration Best Practices](https://www.aem.live/docs/dev-collab-and-good-practices)

---

## URL Testing Guide

**Local development** (code changes reflect immediately):
```
http://localhost:3000/your-page-path
```

**Preview** (after DA.live preview or git push):
```
https://jsmith--nycmasterclass--cloudadoption.aem.page/your-page-path
```

**Live** (after DA.live publish):
```
https://jsmith--nycmasterclass--cloudadoption.aem.live/your-page-path
```

---

## Troubleshooting

### Port 3000 in use

```bash
pkill -f aem-cli
aem up
```

### Git push rejected

Branch may be protected. Verify you're on your feature branch:
```bash
git branch
```

Should show `* jsmith` (your branch name).

### DA.live "Permission denied"

Log out and log back in to refresh IMS tokens.

### AEM CLI not found

Re-run global install:
```bash
npm install -g @adobe/aem-cli
```

On Mac/Linux, may need `sudo`:
```bash
sudo npm install -g @adobe/aem-cli
```

---

## Validation Checklist

Before starting Exercise 1, verify:

- [ ] Repository cloned
- [ ] Feature branch created (e.g., `jsmith`)
- [ ] AEM CLI installed (`aem --version` works)
- [ ] Dependencies installed (`npm install` completed)
- [ ] Linting runs clean (`npm run lint` no errors)
- [ ] Dev server running (`http://localhost:3000` loads)
- [ ] DA.live access verified (can view project)
- [ ] Branch URLs understood (preview vs live)
- [ ] Git workflow clear (lint, add, commit, push)
- [ ] PR process understood (test URLs, Lighthouse scores)

---

## Ready to Start

Once all checklist items are complete, proceed to [Exercise 1](exercise1/instructions.md).
