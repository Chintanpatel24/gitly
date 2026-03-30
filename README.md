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

---

## Unique Classic README Stack

```markdown
## GitHub Dashboard

<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=pulse&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&layout=donut&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>
```

---

## Quick Start

**Replace `YOUR_USERNAME` with your GitHub username. That's it.**

```markdown
## My Stats

<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&hide_border=true"/>

<img src="https://gitlyy.vercel.app/api/languages?username=YOUR_USERNAME&hide_border=true"/>
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
