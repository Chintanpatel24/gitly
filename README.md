</p>

<h1 align="center">Gitly</h1>

<p align="center">
  Custom GitHub stats cards for your README. Real data. No auth required.
  <br/>
  <a href="https://gitlyy.vercel.app"><strong>Live Demo</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-live-brightgreen" alt="Status"/>
  <img src="https://img.shields.io/badge/dependencies-zero-blue" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/auth-not_required-blue" alt="No Auth"/>
  <img src="https://img.shields.io/badge/cache-auto_refresh-orange" alt="Auto Cache"/>
</p>

---

## All Cards

### 1. Profile Card

Shows user info: avatar, name, bio, join date, repos, followers, and following.

<img src="https://gitlyy.vercel.app/api/profile?username=torvalds&hide_border=true" alt="Profile Card"/>

```html
<img src="https://gitlyy.vercel.app/api/profile?username=YOUR_USERNAME&hide_border=true"/>
```

---

### 2. Contribution Numbers

GitHub-style contribution heatmap with daily commit counts.

<img src="https://gitlyy.vercel.app/api/contribution?username=torvalds&hide_border=true" alt="Contribution Grid"/>

```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>
```

**Compact** (total, current streak, longest streak):
```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

**Pulse** (monthly bars + 30-day trend):
```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=pulse&hide_border=true"/>
```

---

### 3. Language Usage

Horizontal stacked bar of languages with percentages using GitHub's official colors.

<img src="https://gitlyy.vercel.app/api/languages?username=torvalds&hide_border=true" alt="Languages"/>

```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&hide_border=true"/>
```

**Compact**:
```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

**Donut**:
```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=donut&hide_border=true"/>
```

---

### 4. Streak Card

Current and longest contribution streaks with fire visual and progress bar.

<img src="https://gitlyy.vercel.app/api/streak?username=torvalds&hide_border=true" alt="Streak Card"/>

```html
<img src="https://gitlyy.vercel.app/api/streak?username=YOUR_USERNAME&hide_border=true"/>
```

---

### 5. Commits Ranking

Days ranked from highest to lowest commit count in descending order.

<img src="https://gitlyy.vercel.app/api/commits?username=torvalds&hide_border=true" alt="Commits Ranking"/>

```html
<img src="https://gitlyy.vercel.app/api/commits?username=YOUR_USERNAME&hide_border=true"/>
```

**Compact** (best day, active days, daily average):
```html
<img src="https://gitlyy.vercel.app/api/commits?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

---

### 6. Pull Request Stats

PR count with per-repository breakdown and progress bars.

<img src="https://gitlyy.vercel.app/api/pr-stats?username=torvalds&hide_border=true" alt="PR Stats"/>

```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&hide_border=true"/>
```

**Compact**:
```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

---

### 7. Working Hours

Estimated total coding hours based on GitHub activity since account creation.

<img src="https://gitlyy.vercel.app/api/working-hours?username=torvalds&hide_border=true" alt="Working Hours"/>

Calculation: `Total Contributions x 1.5 hours/commit`

```html
<img src="https://gitlyy.vercel.app/api/working-hours?username=YOUR_USERNAME&hide_border=true"/>
```

---

### 8. Overview Card

Shows total stats: Stars, Commits, PRs, Issues, Contributed to.

<img src="https://gitlyy.vercel.app/api/overview?username=torvalds&hide_border=true" alt="Overview Card"/>

```html
<img src="https://gitlyy.vercel.app/api/overview?username=YOUR_USERNAME&hide_border=true"/>
```

---

## Quick Start

Copy any card URL and replace `YOUR_USERNAME` with your GitHub username:

```markdown
## My GitHub Stats

<img src="https://gitlyy.vercel.app/api/profile?username=YOUR_USERNAME&hide_border=true"/>
```

### Full README Example

```markdown
## GitHub Stats

<img src="https://gitlyy.vercel.app/api/profile?username=YOUR_USERNAME&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/streak?username=YOUR_USERNAME&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=donut&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/commits?username=YOUR_USERNAME&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&hide_border=true"/>
```

---

## API Endpoints

| Endpoint | Description | Layouts | Refresh |
|----------|-------------|---------|---------|
| `/api/profile` | User profile info | - | 2 hours |
| `/api/contribution` | Contribution heatmap | `default`, `compact`, `pulse` | 30 min |
| `/api/languages` | Language distribution | `default`, `compact`, `donut` | 30 min |
| `/api/streak` | Streak stats | - | 30 min |
| `/api/commits` | Commits ranking | `default`, `compact` | 30 min |
| `/api/pr-stats` | Pull request stats | `default`, `compact` | 30 min |
| `/api/working-hours` | Estimated coding hours | - | 2 hours |
| `/api/overview` | Overall stats summary | - | 30 min |

---

## Parameters

All endpoints support these query parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `username` | GitHub username (required) | `torvalds` |
| `theme` | Color theme | `dark`, `synthwave`, `radical` |
| `hide_border` | Remove card border | `true` |
| `layout` | Card layout variant | `compact`, `pulse`, `donut` |
| `bg_color` | Background color (hex) | `010409` |
| `title_color` | Title color (hex) | `58a6ff` |
| `text_color` | Text color (hex) | `e6edf3` |
| `border_color` | Border color (hex) | `30363d` |
| `width` | Card width (profile card) | `1000` |
| `max_langs` | Max languages shown | `15` |
| `refresh` | Force data refresh | `true` |

---

## Themes

Add `&theme=NAME` to any card URL:

| Theme | Preview Accent |
|-------|---------------|
| `dark` | Blue |
| `synthwave` | Pink |
| `radical` | Hot Pink |
| `tokyonight` | Blue |
| `dracula` | Purple |
| `gruvbox` | Yellow |
| `monokai` | Green |
| `nord` | Cyan |
| `solarized_dark` | Teal |
| `catppuccin` | Lavender |
| `github_dark` | Green |
| `highcontrast` | Yellow |

```html
<img src="https://gitlyy.vercel.app/api/profile?username=YOUR_USERNAME&theme=synthwave&hide_border=true"/>
```

---

## Custom Colors

Override any color with hex values (without `#`):

```
&bg_color=010409&title_color=58a6ff&text_color=e6edf3&border_color=30363d
```

---

## Auto-Refresh

Cards automatically update based on data type:

| Data | Cache Duration |
|------|---------------|
| Contributions, PRs, Languages, Commits, Streak, Overview | 30 minutes |
| Profile, Working Hours | 2 hours |

Data is cached server-side. CDN caches the response. Stale content is served while refreshing in the background.

### Force Refresh

Add `&refresh=true` to any URL to bypass the cache:

```
https://gitlyy.vercel.app/api/profile?username=YOUR_USERNAME&refresh=true
```

---

## How It Works

1. No authentication required - uses public GitHub API
2. Each user's data is cached separately
3. Auto-refreshes when cache expires
4. Works for any public GitHub profile
5. Zero dependencies - pure Node.js

---

## Self-Host

1. Fork this repo
2. Import at [vercel.com](https://vercel.com) (free tier)
3. Click Deploy

---

## License

MIT
