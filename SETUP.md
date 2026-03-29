# Setup & Deployment Guide

## Quick Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- GitHub Personal Access Token

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/github-readme-cards.git
cd github-readme-cards
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Add your GitHub token to `.env`**
```bash
echo "GITHUB_TOKEN=your_token_here" >> .env
```

5. **Run the development server**
```bash
npm run dev
```

The server will start at `http://localhost:9000`

### Test the endpoints

**Pull Requests Card:**
```
GET http://localhost:9000/api/pull-requests?username=octocat&theme=synthwave&hide_border=true
```

**Contributions Card:**
```
GET http://localhost:9000/api/contributions?username=octocat&theme=synthwave&hide_border=true
```

---

## Deployment

### Deploy on Vercel

1. **Fork this repository**

2. **Sign up at** [Vercel.com](https://vercel.com)

3. **Create a new project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your forked repo

4. **Add Environment Variables**
   - Go to Settings → Environment Variables
   - Add `GITHUB_TOKEN` with your PAT value

5. **Deploy!**
   - Click "Deploy"

6. **Update cards in your README**
   ```markdown
   ![PRs](https://your-project.vercel.app/api/pull-requests?username=YOUR_USERNAME&theme=synthwave)
   ![Contributions](https://your-project.vercel.app/api/contributions?username=YOUR_USERNAME&theme=synthwave)
   ```

### Deploy on Railway

1. **Connect your GitHub account** at [Railway.app](https://railway.app)

2. **Create a new project** → "Deploy from GitHub repo"

3. **Select your forked repository**

4. **Add environment variable**
   - Variable: `GITHUB_TOKEN`
   - Value: Your GitHub PAT

5. **Deploy automatically**

Your deployment URL will be provided (e.g., `your-app.railway.app`)

### Deploy on Heroku

1. **Install Heroku CLI**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login and create app**
```bash
heroku login
heroku create your-app-name
```

3. **Set environment variable**
```bash
heroku config:set GITHUB_TOKEN=your_token_here
```

4. **Deploy**
```bash
git push heroku main
```

---

## Getting a GitHub Personal Access Token

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens**

2. Click **Generate new token (classic)**

3. Fill in the form:
   - **Note:** "GitHub Readme Cards"
   - **Expiration:** 90 days (or custom)

4. Select scopes:
   - ✅ `public_repo` - Required
   - ✅ `read:user` - Required

5. Click **Generate token**

6. **Copy the token** (you won't see it again!)

7. Add it to your deployment environment

---

## Using the API

### Base URLs

**Development:** `http://localhost:9000`  
**Production:** `https://your-deployment.vercel.app`

### Endpoints

#### Pull Requests Card
```
GET /api/pull-requests?username=USER[&other_params]
```

**Parameters:**
- `username` (required): GitHub username
- `theme`: Card theme (default, synthwave, dracula, nord, github_dark, onedark, radical, highcontrast)
- `title_color`: Hex color for title
- `text_color`: Hex color for text
- `bg_color`: Hex color for background
- `border_color`: Hex color for border
- `card_width`: Width in pixels (default: 400)
- `hide_border`: true/false (default: false)
- `border_radius`: Radius in pixels
- `custom_title`: Custom title text
- `cache_seconds`: Cache duration (21600 - 2592000)

**Example:**
```
https://your-deployment.vercel.app/api/pull-requests?username=octocat&theme=synthwave&hide_border=true&title_color=orange&text_color=white&bg_color=070d0d
```

#### Contributions Card
```
GET /api/contributions?username=USER[&other_params]
```

**Parameters:**
Same as pull requests card (except default card_width is 850)

**Example:**
```
https://your-deployment.vercel.app/api/contributions?username=octocat&theme=synthwave&hide_border=true&card_width=900
```

---

## Troubleshooting

### "Invalid username" error
- Verify the username is correct and exists on GitHub
- Check spelling (case-sensitive for some services)

### "Something went wrong" error
- Verify `GITHUB_TOKEN` is set in environment
- Check that the token has required scopes (`public_repo`, `read:user`)
- Ensure the token hasn't expired
- Verify your GitHub API access

### Cards showing 404
- Check that your deployment has the correct environment variables
- Verify the API URL is correct
- Test the endpoint directly in your browser

### Rate limiting issues
- Increase the `cache_seconds` parameter (up to 30 days)
- Consider using your own GitHub token instead of a public instance
- Avoid making multiple requests in rapid succession

---

## Development Scripts

```bash
# Run tests
npm test

# Run tests in watch mode
npm test:watch

# Update snapshots
npm test:update:snapshot

# Run linter
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Benchmarking
npm run bench
```

---

## Project Structure

```
.
├── api/                    # API endpoints
│   ├── index.js           # Info endpoint
│   ├── pull-requests.js   # PR card endpoint
│   └── contributions.js    # Contributions card endpoint
├── src/
│   ├── cards/             # Card renderers
│   │   ├── pull-requests.js
│   │   └── contributions.js
│   ├── fetchers/          # Data fetchers
│   │   ├── pull-requests.js
│   │   └── contributions.js
│   └── common/            # Shared utilities
├── tests/                 # Test files
├── express.js             # Express server for local dev
├── vercel.json           # Vercel configuration
├── package.json          # Dependencies
└── readme.md             # Main documentation
```

---

## Next Steps

1. **Deploy to production** (Vercel, Railway, etc.)
2. **Add cards to your GitHub README** using the provided markdown
3. **Customize colors and themes** to match your style
4. **Share with others** and get feedback!

---

## Support

For issues:
- Check [Troubleshooting](#troubleshooting) section
- Open an issue on GitHub
- Review the main [readme.md](./readme.md)

---

**Happy coding! 🚀**
