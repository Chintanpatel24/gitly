# Gitly - Custom GitHub Stats Cards

Embeddable SVG cards for your GitHub README showing pull request stats and contribution numbers. No authentication required for viewers.

## Cards Available

### 1. Pull Request Stats Card

Shows your total pull requests grouped by repository.

**Live URL:** `https://gitlyy.vercel.app`

**Full layout (default):**
```
https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME
```

<img src="https://gitlyy.vercel.app/api/pr-stats?username=torvalds&theme=dark&hide_border=true" alt="PR Stats" width="420"/>

**Compact layout:**
```
https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact
```

<img src="https://gitlyy.vercel.app/api/pr-stats?username=torvalds&layout=compact&theme=dark&hide_border=true" alt="PR Stats Compact" height="155"/>

---

### 2. Contribution Numbers Card

GitHub contribution grid with actual commit counts per day instead of colored dots. Numbers displayed in green shades matching GitHub's dark theme.

**Grid layout (default):**
```
https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME
```

**Compact layout (summary stats):**
```
https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=compact
```

---

## Setup & Deployment

### One-Click Deploy

Deploy your own instance to Vercel (free tier works):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/anthropics/gitly)

### Manual Setup

1. **Fork this repository**

2. **Create a Vercel account** at [vercel.com](https://vercel.com) (free)

3. **Import your forked repo** in Vercel:
   - Click "Add New..." -> "Project"
   - Import your forked repository
   - Click "Deploy" (no configuration needed)

4. **Copy your deployment URL** (e.g., `https://gitly.vercel.app`)

5. **Use the cards in your README** (see usage below)

### Using a Custom Domain (Optional)

In Vercel dashboard:
1. Go to your project -> Settings -> Domains
2. Add your custom domain
3. Follow DNS configuration instructions

---

## Usage

### Pull Request Stats Card

```html
<!-- Full layout - shows all repos -->
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_GITHUB_USERNAME" />

<!-- Compact layout - summary only -->
<img src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_GITHUB_USERNAME&layout=compact" height="155" />
```

### Contribution Numbers Card

```html
<!-- Grid layout - daily numbers in green shades -->
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_GITHUB_USERNAME" />

<!-- Compact layout - total, current streak, longest streak -->
<img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_GITHUB_USERNAME&layout=compact" height="155" />
```

### Markdown Example

```markdown
### My GitHub Stats

![PR Stats](https://gitlyy.vercel.app/api/pr-stats?username=octocat&theme=dark&hide_border=true&layout=compact)

![Contributions](https://gitlyy.vercel.app/api/contribution?username=octocat&theme=dark&hide_border=true)
```

---

## Parameters

### Common Parameters (Both Cards)

| Parameter | Description | Default |
|-----------|-------------|---------|
| `username` | **Required.** GitHub username | - |
| `theme` | Color theme name | `default` |
| `hide_border` | Hide card border (`true`/`false`) | `false` |
| `bg_color` | Custom background hex color (without `#`) | Theme default |
| `title_color` | Custom title hex color | Theme default |
| `text_color` | Custom text hex color | Theme default |
| `border_color` | Custom border hex color | Theme default |
| `layout` | `compact` for summary view | full/grid |
| `title` | Custom title text | Auto-generated |
| `width` | Custom card width in pixels | Auto |

### PR Card Specific

| Parameter | Description | Default |
|-----------|-------------|---------|
| `layout` | `compact` for stats summary, default for repo list | full |

### Contribution Card Specific

| Parameter | Description | Default |
|-----------|-------------|---------|
| `layout` | `compact` for streak summary, default for grid | grid |

---

## Available Themes

| Theme | Preview |
|-------|---------|
| `default` | Light blue on white |
| `dark` | GitHub dark mode |
| `synthwave` | Purple/pink synthwave |
| `radical` | Neon pink/teal |
| `tokyonight` | Tokyo Night colors |
| `dracula` | Dracula theme |
| `gruvbox` | Gruvbox dark |
| `monokai` | Monokai colors |
| `nord` | Nord frost palette |
| `solarized_dark` | Solarized dark |
| `solarized_light` | Solarized light |
| `catppuccin` | Catppuccin Mocha |
| `github_dark` | GitHub dark with green accents |
| `highcontrast` | Black & white high contrast |

Use theme name: `?theme=dracula`

Or override specific colors: `?bg_color=000000&title_color=ff0000&text_color=ffffff`

---

## Full Example for README

```markdown
# Hi there 👋

## My GitHub Stats

<p>
  <img height="155em" src="https://gitlyy.vercel.app/api/pr-stats?username=YOUR_USERNAME&layout=compact&theme=synthwave&bg_color=070d0d&border_color=white&title_color=orange&text_color=white&hide_border=true"/>
</p>

<p>
  <img src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&theme=github_dark&hide_border=true"/>
</p>

<p>
  <img height="155em" src="https://gitlyy.vercel.app/api/contribution?username=YOUR_USERNAME&layout=compact&theme=synthwave&bg_color=070d0d&title_color=orange&text_color=white&hide_border=true"/>
</p>
```

---

## How It Works

```
User's README
     │
     ▼
<img src="https://gitlyy.vercel.app/api/pr-stats?username=xxx">
     │
     ▼
Vercel Serverless Function
     │
     ▼
GitHub REST API (no auth, 60 req/hr per IP)
     │
     ▼
Dynamic SVG Generation
     │
     ▼
Cached Response (40 min) ──▶ Browser renders SVG
```

- **No authentication required** for end users viewing your README
- Uses GitHub's public API (rate limited to 60 requests/hour per IP)
- GitHub data cached **server-side for 40 minutes** (in-memory + CDN)
- Works entirely serverless - no database or persistent storage

---

## Caching

Data updates every **40 minutes** automatically:
- **Server-side cache**: In-memory cache on Vercel functions (40 min TTL)
- **CDN cache**: `Cache-Control` header set to 40 min (`max-age=2400, s-maxage=2400`)
- **Stale-while-revalidate**: Serves stale cache for 10 extra min while refreshing

This means even if your README gets thousands of views, only 1 GitHub API call is made per 40 minutes per user.

---

## Rate Limits

The cards use GitHub's public API without authentication:
- **60 requests/hour** per IP address
- With 40-min caching, only ~1.5 calls/hour per user needed
- For higher limits, set a `GITHUB_TOKEN` environment variable in Vercel

To add a GitHub token for higher rate limits:
1. Create a Personal Access Token at [github.com/settings/tokens](https://github.com/settings/tokens) (no scopes needed)
2. In Vercel: Project Settings -> Environment Variables
3. Add `GITHUB_TOKEN` with your token value
4. Redeploy

---

## Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Clone the repo
git clone https://github.com/your-username/gitly.git
cd gitly

# Start dev server
vercel dev

# Test locally
curl "http://localhost:3000/api/pr-stats?username=octocat"
curl "http://localhost:3000/api/contribution?username=octocat&theme=dark"
```

---

## License

MIT
