# GitHub Readme Cards

Minimal custom GitHub README cards with two endpoints:

- Pull Requests card
- Contributions card

No GitHub token is required for basic usage.

## Endpoints

- /api/pull-requests
- /api/contributions

## Quick Usage

Replace YOUR_USERNAME with your GitHub username.

```md
<img height="155em" src="https://your-deployment.vercel.app/api/pull-requests?username=YOUR_USERNAME&theme=synthwave&hide_border=true&bg_color=070d0d&border_color=white&title_color=orange&text_color=white" alt="Pull Requests"/>

<img height="220em" src="https://your-deployment.vercel.app/api/contributions?username=YOUR_USERNAME&theme=synthwave&hide_border=true&bg_color=070d0d&border_color=white&title_color=orange&text_color=white" alt="Contributions"/>
```

## Pull Requests Card

```md
https://your-deployment.vercel.app/api/pull-requests?username=YOUR_USERNAME
```

Parameters:

- username (required)
- theme
- title_color
- text_color
- bg_color
- border_color
- card_width
- hide_border
- border_radius
- custom_title
- disable_animations
- cache_seconds

## Contributions Card

```md
https://your-deployment.vercel.app/api/contributions?username=YOUR_USERNAME
```

Parameters:

- username (required)
- theme
- title_color
- text_color
- bg_color
- border_color
- card_width
- hide_border
- border_radius
- custom_title
- disable_animations
- cache_seconds

## Run Locally

```bash
npm install
npm run dev
```

Then open:

- http://127.0.0.1:9000/api/pull-requests?username=octocat
- http://127.0.0.1:9000/api/contributions?username=octocat

## Deploy

Deploy this repo to any Node.js host (Vercel, Railway, Render, etc.).

