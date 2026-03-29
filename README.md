# GitHub Cards

> Drop-in SVG cards for any GitHub README.  
> Just swap the username in the URL — no config, no auth needed for PR cards.

---

## Cards

### Pull Request Tracker

```md
<img src="https://YOUR-DOMAIN/api/pr-card?username=YOUR_USERNAME" />
```

Shows all pull requests grouped by repo, with PR number, title, and state (open / merged / closed).

---

### Commit Heatmap with Numbers

```md
<img src="https://YOUR-DOMAIN/api/contrib-card?username=YOUR_USERNAME" />
```

A full 53-week contribution grid where every cell shows the **actual commit count** as a number.  
Color scale exactly matches GitHub's dark theme green palette.

| Commits/day | Color     |
|-------------|-----------|
| 0           | `#161b22` |
| 1–3         | `#0e4429` |
| 4–7         | `#006d32` |
| 8–15        | `#26a641` |
| 16+         | `#39d353` |

---

## Use in your README

```md
## GitHub Stats

<img src="https://YOUR-DOMAIN/api/pr-card?username=YOUR_USERNAME" />

<img src="https://YOUR-DOMAIN/api/contrib-card?username=YOUR_USERNAME" />
```

Replace `YOUR-DOMAIN` with your deployed URL and `YOUR_USERNAME` with any GitHub username.

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New → Import Git Repository**
3. Select this repo → Deploy
4. *(Optional)* Add `GITHUB_TOKEN` in **Settings → Environment Variables**  
   - Scope: `read:user` — enables real contribution data via GraphQL  
   - Without it: falls back to public Events API (last 100 push events)

---

## Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/github-cards
cd github-cards
node server.js
# With real contribution data:
GITHUB_TOKEN=ghp_xxx node server.js
```

- PR card: http://localhost:3000/api/pr-card?username=torvalds  
- Heatmap: http://localhost:3000/api/contrib-card?username=torvalds

---

## File Structure

```
github-cards/
├── server.js              # HTTP server, routing, caching
├── lib/
│   ├── pr-card.js         # PR tracker SVG generator
│   ├── contrib-card.js    # Heatmap SVG generator (numbers in cells)
│   └── github.js          # GitHub API (REST + GraphQL)
├── vercel.json
└── package.json
```

---

MIT License
