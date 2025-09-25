// server.js
const http = require('http');
const os = require('os');
const PORT = 81;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>DevOps Training — Interactive Dashboard</title>
<link rel="icon" href="data:,">
<style>
  /* CSS Reset (small) */
  *,*::before,*::after{box-sizing:border-box}
  html,body{height:100%;margin:0;font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
  :root{
    --bg1:#0f1724;
    --bg2:#071024;
    --accent1:#7c3aed;
    --accent2:#06b6d4;
    --glass: rgba(255,255,255,0.06);
    --glass-2: rgba(255,255,255,0.04);
    --muted: rgba(255,255,255,0.72);
    --glass-border: rgba(255,255,255,0.06);
  }

  /* Animated gradient background */
  body{
    background: radial-gradient(1200px 600px at 10% 10%, rgba(124,58,237,0.12), transparent 8%),
                radial-gradient(800px 400px at 90% 90%, rgba(6,182,212,0.07), transparent 8%),
                linear-gradient(180deg,var(--bg1),var(--bg2));
    color: white;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:32px;
  }

  /* Main container */
  .app {
    width:100%;
    max-width:1200px;
    margin:0 auto;
    padding:28px;
    display:grid;
    gap:20px;
    grid-template-columns: 1fr 380px;
  }

  /* Header card */
  .hero {
    grid-column: 1 / -1;
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:16px;
    background: linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius:20px;
    padding:22px;
    box-shadow: 0 6px 30px rgba(2,6,23,0.6), inset 0 1px 0 rgba(255,255,255,0.02);
    border:1px solid var(--glass-border);
    backdrop-filter: blur(8px) saturate(115%);
  }

  .hero .title {
    display:flex;
    gap:18px;
    align-items:center;
  }
  .logo {
    width:84px;height:84px;border-radius:16px;
    background: linear-gradient(135deg,var(--accent1),var(--accent2));
    display:grid;place-items:center;
    font-weight:700;font-size:28px;
    box-shadow:0 6px 20px rgba(124,58,237,0.18);
  }
  h1{margin:0;font-size:20px;line-height:1.05}
  p.lead{margin:0;color:var(--muted);font-size:13px}

  /* Controls */
  .controls{display:flex;gap:12px;align-items:center}
  .btn {
    background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border:1px solid rgba(255,255,255,0.04);
    padding:10px 14px;border-radius:12px;color:inherit;
    cursor:pointer;font-weight:600;font-size:13px;
    transition:transform .14s ease, box-shadow .14s ease;
    backdrop-filter: blur(6px);
  }
  .btn:active{transform:translateY(1px)}
  .btn.primary{
    background: linear-gradient(90deg,var(--accent1),var(--accent2));
    color:white;box-shadow: 0 8px 28px rgba(7,16,36,0.45);
  }

  /* Grid of cards */
  .grid {
    display:grid;
    grid-template-columns: repeat(2,1fr);
    gap:16px;
  }

  .card {
    background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
    border-radius:14px;padding:16px;border:1px solid var(--glass-border);
    box-shadow: 0 6px 18px rgba(2,6,23,0.5);
    backdrop-filter: blur(6px);
  }
  .card h3{margin:0 0 8px 0;font-size:14px}
  .muted{color:var(--muted);font-size:13px}

  /* Stats row */
  .stats {display:flex;gap:12px;}
  .stat {
    flex:1;padding:12px;border-radius:12px;background:linear-gradient(180deg, rgba(255,255,255,0.015), transparent);
    text-align:center;
    border:1px solid rgba(255,255,255,0.02);
  }
  .big{font-size:20px;font-weight:700}
  .small{font-size:12px;color:var(--muted)}

  /* Right column */
  .right {
    display:flex;flex-direction:column;gap:16px;
  }

  /* Animated wave separator */
  .wave {
    height:10px;width:100%;margin-top:12px;opacity:0.6;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.02), transparent);
    border-radius:8px;
  }

  /* Footer */
  footer{grid-column:1/-1;text-align:center;color:var(--muted);font-size:13px;padding-top:8px}

  /* Responsive */
  @media (max-width:900px){
    .app{grid-template-columns: 1fr; padding:18px}
    .grid{grid-template-columns:1fr}
    .hero{flex-direction:column;align-items:flex-start}
    .controls{width:100%;justify-content:space-between}
  }

  /* small animated element */
  .pulse {
    width:12px;height:12px;border-radius:50%;background:linear-gradient(90deg,var(--accent1),var(--accent2));
    box-shadow:0 6px 16px rgba(7,16,36,0.45);
    position:relative;
    animation: pulse 2s infinite;
  }
  @keyframes pulse{
    0%{transform:scale(1);opacity:1}
    70%{transform:scale(1.9);opacity:0}
    100%{opacity:0}
  }

  /* fancy code snippet style */
  pre.code {
    background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06));
    padding:12px;border-radius:8px;overflow:auto;font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, "Roboto Mono", monospace;
    font-size:13px;color:#e6eef8;
  }

  /* micro-interaction for cards */
  .card:hover{transform:translateY(-6px);transition:transform .18s ease}
</style>
</head>
<body>
  <main class="app" role="main" aria-labelledby="mainTitle">
    <section class="hero" aria-label="Hero">
      <div class="title">
        <div class="logo">DV</div>
        <div>
          <h1 id="mainTitle">Welcome to DevOps Training</h1>
          <p class="lead" id="subtitle">Interactive dashboard — live server info, dynamic UI and modern CSS</p>
          <div class="wave" aria-hidden="true"></div>
        </div>
      </div>

      <div class="controls" aria-hidden="false">
        <div style="display:flex;gap:10px;align-items:center">
          <div style="text-align:right">
            <div class="muted" id="localTimeLabel">Local time</div>
            <div style="font-weight:700" id="localTime">--:--:--</div>
          </div>
          <div style="width:8px"></div>
          <div title="Live pulse"><span class="pulse" id="pulseDot"></span></div>
        </div>

        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn" id="refreshBtn" title="Refresh server info">Refresh</button>
          <button class="btn primary" id="themeBtn" title="Toggle theme">Toggle style</button>
        </div>
      </div>
    </section>

    <!-- Left column -->
    <section style="display:flex;flex-direction:column;gap:16px;">
      <div class="grid">
        <div class="card" aria-labelledby="statusTitle">
          <h3 id="statusTitle">Server Status</h3>
          <div id="serverStatusMsg" class="muted">Fetching ...</div>
          <div style="margin-top:12px" id="serverJson">
            <pre class="code" id="jsonBlock">{ loading }</pre>
          </div>
        </div>

        <div class="card">
          <h3>Quick Actions</h3>
          <div style="display:flex;flex-direction:column;gap:8px;margin-top:8px">
            <button class="btn" id="showWelcome">Show Welcome</button>
            <button class="btn" id="openDocs">Open Docs</button>
            <div class="muted">Try these buttons to see dynamic UI updates.</div>
          </div>
        </div>

        <div class="card">
          <h3>Live Metrics</h3>
          <div class="stats" style="margin-top:10px">
            <div class="stat">
              <div class="big" id="uptime">--</div>
              <div class="small">Uptime</div>
            </div>
            <div class="stat">
              <div class="big" id="mem">--</div>
              <div class="small">Free mem</div>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>About This Page</h3>
          <p class="muted" style="margin-top:8px">This page is served from a tiny Node.js HTTP server (single-file). It uses a small API at <code>/api/status</code> to show live server info.</p>
          <div style="margin-top:10px">
            <pre class="code">node server.js
open http://localhost:81</pre>
          </div>
        </div>
      </div>

      <footer>Made with ♥ for DevOps training — modern CSS, responsive, and dynamic.</footer>
    </section>

    <!-- Right column -->
    <aside class="right" aria-label="Right column">
      <div class="card">
        <h3>Quick Tip</h3>
        <p class="muted">Use this template as a starting point for a dashboard. Extend the API to return metrics, logs, or other telemetry and render them here.</p>
      </div>

      <div class="card">
        <h3>Live Console</h3>
        <div id="console" style="font-family:ui-monospace,monospace;font-size:13px;max-height:180px;overflow:auto;padding-top:8px;color:#d8efff">Ready.</div>
      </div>
    </aside>
  </main>

<script>
  // Basic client-side dynamic behaviour
  const $ = id => document.getElementById(id);
  const refreshBtn = $('refreshBtn');
  const themeBtn = $('themeBtn');
  const localTime = $('localTime');
  const consoleBox = $('console');

  function log(msg){
    const time = new Date().toLocaleTimeString();
    consoleBox.innerText = time + ' — ' + msg + '\\n' + consoleBox.innerText;
  }

  async function fetchStatus(){
    try{
      const res = await fetch('/api/status');
      if(!res.ok) throw new Error('Network response not ok');
      const data = await res.json();
      $('jsonBlock').innerText = JSON.stringify(data, null, 2);
      $('serverStatusMsg').innerText = 'Server running on ' + data.hostname + ' (' + data.platform + ')';
      $('uptime').innerText = formatSeconds(data.uptime);
      $('mem').innerText = formatBytes(data.freeMem);
      log('Fetched status');
    }catch(e){
      $('jsonBlock').innerText = '{ error: "'+ (e.message||e) + '" }';
      $('serverStatusMsg').innerText = 'Error fetching server status';
      log('Error: ' + (e.message||e));
    }
  }

  function formatBytes(bytes){
    if(bytes < 1024) return bytes + ' B';
    const units = ['KB','MB','GB','TB'];
    let i = -1;
    do { bytes = bytes / 1024; i++; } while(bytes >= 1024 && i < units.length-1);
    return bytes.toFixed(1) + ' ' + units[i];
  }
  function formatSeconds(s){
    if(s < 60) return Math.floor(s) + 's';
    const h = Math.floor(s/3600);
    const m = Math.floor((s%3600)/60);
    const sec = Math.floor(s%60);
    return (h?h+'h ':'') + (m?m+'m ':'') + sec+'s';
  }

  refreshBtn.addEventListener('click', () => {
    fetchStatus();
    log('Manual refresh triggered');
  });

  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('alt');
    log('Toggled theme');
    // small style flip
    if(document.body.classList.contains('alt')){
      document.documentElement.style.setProperty('--bg1','#071024');
      document.documentElement.style.setProperty('--bg2','#02121a');
    } else {
      document.documentElement.style.setProperty('--bg1','#0f1724');
      document.documentElement.style.setProperty('--bg2','#071024');
    }
  });

  // update local clock every second
  setInterval(() => {
    localTime.innerText = new Date().toLocaleString();
  }, 1000);

  // initial fetch
  fetchStatus();

  // nice small UI interactions
  document.getElementById('showWelcome').addEventListener('click', () => {
    $('mainTitle').innerText = 'Welcome — Happy learning!';
    log('Displayed welcome message');
  });
  document.getElementById('openDocs').addEventListener('click', () => {
    window.open('https://nodejs.org/en/docs/', '_blank');
    log('Opened Node.js docs');
  });

  // heartbeat pulse (color swap)
  setInterval(() => {
    const d = document.getElementById('pulseDot');
    d.style.boxShadow = d.style.boxShadow ? '' : '0 10px 30px rgba(7,16,36,0.45)';
  }, 1200);

</script>
</body>
</html>
`;

// create server with a small API route
const server = http.createServer((req, res) => {
  if (req.url === '/api/status') {
    // return some live server information
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      uptime: Math.floor(os.uptime()),         // seconds
      totalMem: os.totalmem(),
      freeMem: os.freemem(),
      cpus: os.cpus().length,
      loadavg: os.loadavg ? os.loadavg() : [],
      timestamp: new Date().toISOString()
    };
    const body = JSON.stringify(info);
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
      'Access-Control-Allow-Origin': '*'
    });
    res.end(body);
    return;
  }

  // serve the HTML page for any other request
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log('Server listening on http://localhost:' + PORT);
});
