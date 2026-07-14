# My Recipe Book

A simple Jekyll-based recipe site, built to run on GitHub Pages.

## Adding a recipe

Create a new `.md` file in `_recipes/`, e.g. `_recipes/pad-thai.md`:

```markdown
---
title: Pad Thai
prep_time: 20 min
cook_time: 15 min
servings: 4
tags: [dinner, thai]
---

## Ingredients
- ...

## Instructions
1. ...
```

That's it — it will automatically show up on the homepage and get its own page.

## Deploying to GitHub Pages

1. Create a new repo on GitHub.
   - If you want it at `https://yourname.github.io`, name the repo exactly `yourname.github.io`.
   - Otherwise, name it anything (e.g. `recipes`) — it'll be served at `https://yourname.github.io/recipes`. If you do this, set `baseurl: "/recipes"` in `_config.yml`.
2. Push these files to the repo:
   ```bash
   git init
   git add .
   git commit -m "Initial recipe site"
   git branch -M main
   git remote add origin https://github.com/yourname/yourrepo.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**, and set the source to the `main` branch (root folder).
4. Wait a minute or two — your site will be live at the URL shown in Settings → Pages.

## Running locally (optional, needs Ruby)

```bash
bundle install
bundle exec jekyll serve
```

Then visit `http://localhost:4000`.
