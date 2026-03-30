# Gitly - Custom GitHub Stats Cards

Embeddable SVG cards for your GitHub README. Real data. No auth required.

**Live:** https://gitlyy.vercel.app

---

## Cards

### 1. Pull Request Stats

<img src="https://gitlyy.vercel.app/api/pr-stats?username=torvalds&layout=compact&hide_border=true" alt="PR Stats Compact" height="165"/>

```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

Full layout (repo list):
```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&hide_border=true"/>
```

### 2. Contribution Numbers

<img src="https://gitlyy.vercel.app/api/contribution?username=torvalds&hide_border=true" alt="Contribution Grid"/>

```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>
```

Compact:
```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

Pulse graph (new):
```html
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=pulse&hide_border=true"/>
```

### 3. Language Usage

<img src="https://gitlyy.vercel.app/api/languages?username=torvalds&hide_border=true" alt="Languages"/>

```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&hide_border=true"/>
```

Compact:
```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

Donut graph (new):
```html
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=donut&hide_border=true"/>
```

### 4. Master Card (NEW!) - True All-in-One Dashboard

<img src="https://gitlyy.vercel.app/api/master?username=torvalds&hide_border=true" alt="Master Stats Card" width="100%"/>

The master card now includes all major visual sections in one SVG:
- **Visitor Counter** - Live profile views
- **PR Stats** - Total and Open pull requests
- **Repositories** - Public repo count
- **Contributions** - Total contributions
- **Top Repositories** - Your most active repositories
- **Top Languages** - Language percentage bars
- **Contribution Heatmap** - GitHub-style recent activity grid

```html
<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&hide_border=true&width=1000"/>
```

Custom width (recommended 1000px+):
```html
<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&hide_border=true&width=1000"/>
```

With theme:
```html
<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&theme=synthwave&hide_border=true"/>
```

If GitHub README shows an old image, force refresh once:
```html
<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&hide_border=true&refresh=true"/>
```

### 5. Visitors Counter (NEW!)

<img src="https://gitlyy.vercel.app/api/visitors?username=torvalds&hide_border=true" alt="Visitors Counter" height="120"/>

Track profile views with a live visitor counter:

```html
<img src="https://gitlyy.vercel.app/api/visitors?username=YOUR_USERNAME&hide_border=true"/>
```

---

## Quick Examples

**Single Card (Recommended - All-in-One):**
```markdown
## 📊 GitHub Stats

<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&hide_border=true&width=1000"/>
```

**Multiple Views:**
```markdown
## 🧑‍💻 My GitHub Stats

<!-- Comprehensive Dashboard -->
<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&hide_border=true&width=1000"/>

<!-- Contribution Activity Graph -->
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=pulse&hide_border=true"/>
```

**Individual Cards:**
```markdown
<!-- Visitor Counter -->
<img src="https://gitlyy.vercel.app/api/visitors?username=YOUR_USERNAME&hide_border=true"/>

<!-- Master Dashboard -->
<img src="https://gitlyy.vercel.app/api/master?username=YOUR_USERNAME&hide_border=true"/>

<!-- Contribution Grid -->
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>

<!-- Language Distribution -->
<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=donut&hide_border=true"/>

<!-- PR Stats -->
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

---

## Auto-Refresh

Cards automatically refresh every **30 minutes**. No manual action needed.

- Data cached server-side for 30 min
- CDN caches for 30 min
- Stale content served for 10 extra min while refreshing in background
- Each user's data cached separately (no conflicts)

---

## Force Refresh

Add `&refresh=true` to force immediate data refresh:

```
https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&refresh=true
```

---

## Themes

Add `&theme=NAME`:

`dark` `synthwave` `radical` `tokyonight` `dracula` `gruvbox` `monokai` `nord` `solarized_dark` `catppuccin` `github_dark` `highcontrast`

```html
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&theme=synthwave&hide_border=true"/>
```

---

## Custom Colors

`&bg_color=010409&title_color=58a6ff&text_color=e6edf3`

---

## Parameters

| Param | Description | Example |
|-------|-------------|---------|
| `username` | GitHub username (required) | `torvalds` |
| `theme` | Color theme | `dark` |
| `hide_border` | Hide border | `true` |
| `layout` | `compact` \/ `pulse` (contribution) \/ `donut` (languages) | `compact` |
| `bg_color` | Background hex | `010409` |
| `title_color` | Title color hex | `58a6ff` |
| `text_color` | Text color hex | `e6edf3` |
| `max_langs` | Max languages (lang card) | `15` |
| `refresh` | Force refresh data | `true` |

---

## How It Works

- Anyone can use `https://gitlyy.vercel.app` - no setup
- Each user cached separately for 30 minutes
- Auto-refreshes when cache expires
- No auth required
- Unlimited users simultaneously

---

## Self-Host

1. Fork this repo
2. Import at [vercel.com](https://vercel.com) (free)
3. Click Deploy

---

## License

MIT
