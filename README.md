<div align=center>

![title image](images/gitlyy.png)

</div>

<p align="center">
  <img src="https://img.shields.io/badge/status-live-brightgreen" alt="Status"/>
  <img src="https://img.shields.io/badge/dependencies-zero-blue" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/auth-not_required-blue" alt="No Auth"/>
  <img src="https://img.shields.io/badge/cache-auto_refresh-orange" alt="Auto Cache"/>
</p>

---
> ## Custom GitHub stats cards for your README. Real data. No auth required.

### 1. Profile Card

- Shows user info: avatar, name, bio, join date, repos, followers, and following.

<img src="images/1.png">

```html
<img src="https://gitlyy.vercel.app/api/profile?username=YOUR_USERNAME&hide_border=true"/>
```

---

### 2. Contribution Numbers

 I. GitHub-style contribution heatmap with daily commit counts.

<img src="images/2.png">

```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>
```

 II. **Pulse** (monthly bars + 30-day trend):
 
 <img src="images/4.png">
 
```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=pulse&hide_border=true"/>
```

---

### 3. Language Usage

 I. Horizontal stacked bar of languages with percentages using GitHub's official colors.

<img src="images/5.png">

```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&hide_border=true"/>
```

 II. **Compact**:
 
<img src="images/6.png">

```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

 III. **Donut**:
 
 <img src="images/7.png">

```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=donut&hide_border=true"/>
```

---

### 4. Streak Card

I. Current and longest contribution streaks with fire visual and progress bar.

<img src="images/8.png">

```html
<img src="https://gitlyy.vercel.app/api/streak?username=YOUR_USERNAME&hide_border=true"/>
```

II. **Compact** (total, current streak, longest streak):

<img src="images/3.png">

```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```
---

### 5. Commits Ranking

 I. PR-style ranked list of days from highest to lowest commit count, with large green square markers and count bars.

<img src="images/9.png">

```html
<img src="https://gitlyy.vercel.app/api/commits?username=YOUR_USERNAME&hide_border=true"/>
```

 II. **Custom width**:
 
```html
<img src="https://gitlyy.vercel.app/api/commits?username=YOUR_USERNAME&width=520&hide_border=true"/>
```

 III. **Compact** (best day, active days, daily average):

 <img src="images/10.png">


```html
<img src="https://gitlyy.vercel.app/api/commits?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

---

### 6. Pull Request Stats 

 I. PR count with per-repository breakdown and progress bars.

<img src="images/11.png">

```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&hide_border=true"/>
```

 II. **Compact**:

<img src="images/12.png">

```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

---

### 7. Working Hours

- Calculates actual coding hours by analyzing commit timestamp gaps.

<img src="images/13.png">

**Formula:** `TWt = Σ (Ti+1 - Ti) for all i where (Ti+1 - Ti) < 5 hours`

Where:
- `TWt` = Total Working Time
- `Σ` = Sum of all
- `Ti` = Timestamp of commit i
- `Ti+1` = Timestamp of next commit
- **Threshold:** Only counts gaps < 5 hours (assumes longer gaps are breaks/sleep)

```html
<img src="https://gitlyy.vercel.app/api/working-hours?username=YOUR_USERNAME&hide_border=true"/>
```

---

### 8. Overview Card

- Shows total stats: Stars, Commits, PRs, Issues, Contributed to.

<img src="images/14.png">

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
| `width` | Card width (supported by profile, PR stats, commits) | `520` |
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
