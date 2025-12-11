function highlightJson(json) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(
      /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")\s*:/g,
      '<span class="json-key">$1</span><span class="json-punctuation">:</span>',
    )
    .replace(
      /("(?:\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*")/g,
      '<span class="json-string">$1</span>',
    )
    .replace(
      /\b(-?\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g,
      '<span class="json-number">$1</span>',
    )
    .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>')
    .replace(/\bnull\b/g, '<span class="json-null">null</span>');
}

export default {
  async fetch(request) {
    const subrequest = new Request(request);
    const newResponse = await fetch(subrequest);

    const requestHeadersRaw = JSON.stringify(
      Object.fromEntries(subrequest.headers),
      null,
      2,
    );
    const responseHeadersRaw = JSON.stringify(
      Object.fromEntries(newResponse.headers),
      null,
      2,
    );
    const cfRaw = JSON.stringify(request.cf, null, 2);

    const requestHeaders = highlightJson(requestHeadersRaw);
    const responseHeaders = highlightJson(responseHeadersRaw);
    const cf = highlightJson(cfRaw);

    const data = [
      { request: Object.fromEntries(subrequest.headers) },
      { response: Object.fromEntries(newResponse.headers) },
      { cf: request.cf },
    ];

    const json = JSON.stringify(data);

    const userAgent = request.headers.get("User-Agent");
    const isBrowser = userAgent && userAgent.includes("Mozilla");

    const htmlStyle = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace;
        background: #0d1117;
        color: #c9d1d9;
        padding: 20px;
        line-height: 1.5;
      }

      .container {
        max-width: 1600px;
        margin: 0 auto;
      }

      h1 {
        color: #f6821f;
        font-size: 24px;
        margin-bottom: 8px;
        font-weight: 600;
      }

      .subtitle {
        color: #8b949e;
        margin-bottom: 32px;
        font-size: 14px;
      }

      .section {
        margin-bottom: 24px;
        border: 1px solid #30363d;
        background: #0d1117;
        border-radius: 8px;
        overflow: hidden;
      }

      .section-header {
        padding: 12px 16px;
        background: #161b22;
        border-bottom: 1px solid #30363d;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        user-select: none;
      }

      .section-header:hover {
        background: #1c2128;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: #c9d1d9;
      }

      .section-controls {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .copy-btn {
        background: transparent;
        border: 1px solid #30363d;
        color: #8b949e;
        padding: 4px 12px;
        font-size: 12px;
        cursor: pointer;
        font-family: inherit;
        border-radius: 4px;
        transition: all 0.15s;
      }

      .copy-btn:hover {
        border-color: #8b949e;
        color: #c9d1d9;
        background: #161b22;
      }

      .copy-btn.copied {
        border-color: #238636;
        color: #3fb950;
      }

      .toggle {
        color: #8b949e;
        font-size: 12px;
        transition: transform 0.2s;
      }

      .toggle.collapsed {
        transform: rotate(-90deg);
      }

      .section-body {
        padding: 16px;
        max-height: 600px;
        overflow: auto;
      }

      .section-body.collapsed {
        display: none;
      }

      /* Custom scrollbar styles */
      .section-body::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      .section-body::-webkit-scrollbar-track {
        background: #0d1117;
        border-left: 1px solid #30363d;
      }

      .section-body::-webkit-scrollbar-thumb {
        background: #30363d;
        border-radius: 6px;
        border: 2px solid #0d1117;
      }

      .section-body::-webkit-scrollbar-thumb:hover {
        background: #484f58;
      }

      .section-body::-webkit-scrollbar-corner {
        background: #0d1117;
      }

      pre {
        background: #0d1117;
        color: #c9d1d9;
        font-family: inherit;
        font-size: 13px;
        overflow-x: auto;
        white-space: pre;
        margin: 0;
      }

      /* JSON syntax highlighting */
      .json-key { color: #7ee787; }
      .json-string { color: #a5d6ff; }
      .json-number { color: #79c0ff; }
      .json-boolean { color: #ff7b72; }
      .json-null { color: #ff7b72; }
      .json-punctuation { color: #8b949e; }

      pre::-webkit-scrollbar {
        width: 12px;
        height: 12px;
      }

      pre::-webkit-scrollbar-track {
        background: #0d1117;
      }

      pre::-webkit-scrollbar-thumb {
        background: #30363d;
        border-radius: 6px;
        border: 2px solid #0d1117;
      }

      pre::-webkit-scrollbar-thumb:hover {
        background: #484f58;
      }

      @media (min-width: 1920px) {
        .container {
          max-width: 1800px;
        }

        .section-body {
          max-height: 800px;
        }
      }

      @media (max-width: 768px) {
        body {
          padding: 12px;
        }

        .container {
          max-width: 100%;
        }

        h1 {
          font-size: 20px;
        }

        .section-header {
          padding: 10px 12px;
        }

        .section-body {
          padding: 12px;
          max-height: 400px;
        }

        pre {
          font-size: 12px;
        }

        .section-body::-webkit-scrollbar,
        pre::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
      }
    `;

    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>whatami</title>
        <style>${htmlStyle}</style>
      </head>
      <body>
        <div class="container">
          <h1>whatami</h1>
          <div class="subtitle">request metadata</div>

          <div class="section">
            <div class="section-header" onclick="toggleSection(this)">
              <div class="section-title">request headers</div>
              <div class="section-controls">
                <button class="copy-btn" onclick="event.stopPropagation(); copy('req', this)">copy</button>
                <span class="toggle">▼</span>
              </div>
            </div>
            <div class="section-body">
              <pre id="req">${requestHeaders}</pre>
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection(this)">
              <div class="section-title">response headers</div>
              <div class="section-controls">
                <button class="copy-btn" onclick="event.stopPropagation(); copy('res', this)">copy</button>
                <span class="toggle">▼</span>
              </div>
            </div>
            <div class="section-body">
              <pre id="res">${responseHeaders}</pre>
            </div>
          </div>

          <div class="section">
            <div class="section-header" onclick="toggleSection(this)">
              <div class="section-title">cf object</div>
              <div class="section-controls">
                <button class="copy-btn" onclick="event.stopPropagation(); copy('cf', this)">copy</button>
                <span class="toggle">▼</span>
              </div>
            </div>
            <div class="section-body">
              <pre id="cf">${cf}</pre>
            </div>
          </div>
        </div>

        <script>
          function toggleSection(header) {
            const body = header.nextElementSibling;
            const toggle = header.querySelector('.toggle');
            body.classList.toggle('collapsed');
            toggle.classList.toggle('collapsed');
          }

          const rawData = {
            req: ${JSON.stringify(requestHeadersRaw)},
            res: ${JSON.stringify(responseHeadersRaw)},
            cf: ${JSON.stringify(cfRaw)}
          };

          function copy(id, btn) {
            navigator.clipboard.writeText(rawData[id]).then(() => {
              btn.classList.add('copied');
              btn.textContent = 'copied';
              setTimeout(() => {
                btn.classList.remove('copied');
                btn.textContent = 'copy';
              }, 1500);
            });
          }
        </script>
      </body>
    </html>`;

    if (isBrowser) {
      const htmlResponse = new Response(html, {
        status: newResponse.status,
        statusText: newResponse.statusText,
        headers: new Headers(newResponse.headers),
      });
      htmlResponse.headers.set("cf-edge-cache", "no-cache");
      htmlResponse.headers.set("content-type", "text/html;charset=UTF-8");
      return htmlResponse;
    }

    const jsonResponse = new Response(json, {
      status: newResponse.status,
      statusText: newResponse.statusText,
      headers: new Headers(newResponse.headers),
    });
    jsonResponse.headers.set("cf-edge-cache", "no-cache");
    jsonResponse.headers.set("content-type", "application/json");
    return jsonResponse;
  },
};
