module.exports = (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>GitHub Cards</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;background:#0d1117;color:#e6edf3;padding:48px 24px;max-width:720px;margin:0 auto}
h1{font-size:22px;font-weight:700;margin-bottom:6px}
.sub{color:#8b949e;font-size:14px;margin-bottom:40px}
h2{font-size:14px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:.5px;margin:32px 0 10px;border-bottom:1px solid #21262d;padding-bottom:6px}
.box{background:#161b22;border:1px solid #30363d;border-radius:6px;padding:14px 18px;font-family:'SFMono-Regular',Consolas,monospace;font-size:12px;color:#58a6ff;line-height:2;margin-bottom:8px;word-break:break-all}
p{color:#8b949e;font-size:13px;line-height:1.7;margin-bottom:10px}
</style>
</head>
<body>
<h1>GitHub Cards</h1>
<p class="sub">SVG cards for any GitHub README. Change the username in the URL and it works for anyone.</p>

<h2>Pull Request Card</h2>
<p>Shows all pull requests grouped by repo with number, title, and state.</p>
<div class="box">/api/pr-card?username=YOUR_USERNAME</div>

<h2>Commit Heatmap</h2>
<p>Full 53-week grid with the actual commit count shown in each cell. GitHub dark theme color scale.</p>
<div class="box">/api/contrib-card?username=YOUR_USERNAME</div>

<h2>Paste in your README.md</h2>
<div class="box">
&lt;img src="https://YOUR-DOMAIN/api/pr-card?username=YOUR_USERNAME" /&gt;<br><br>
&lt;img src="https://YOUR-DOMAIN/api/contrib-card?username=YOUR_USERNAME" /&gt;
</div>
</body>
</html>`);
};
