export default {
  async fetch(request) {
    const subrequest = new Request(request);
    const newResponse = await fetch(subrequest);

    const requestHeaders = JSON.stringify(Object.fromEntries(subrequest.headers), null, 2);
    const responseHeaders = JSON.stringify(Object.fromEntries(newResponse.headers), null, 2);
    const cf = JSON.stringify(request.cf, null, 2);

    const data = [
      { request: Object.fromEntries(subrequest.headers) },
      { response: Object.fromEntries(newResponse.headers) },
      { cf: request.cf },
    ];

    const json = JSON.stringify(data);

    const userAgent = request.headers.get('User-Agent');
    const isBrowser = userAgent && userAgent.includes('Mozilla');

    const htmlStyle = 
      'body {padding:6em; font-family: sans-serif;} h1 {color:#f6821f} h2 {color:#f6821f}';

    const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>What Am I?</title>
        <style>${htmlStyle}</style>
      </head>
      <body>
        <h1>What am I?</h1>
        <p>You now have access to your metadata.</p>
        <h2>Request Headers</h2>
        <pre>${requestHeaders}</pre>
        <h2>Response Headers</h2>
        <pre>${responseHeaders}</pre>
        <h2>CF Objects</h2>
        <pre>${cf}</pre>
      </body>
    </html>`;

    if (isBrowser) {
      const htmlResponse = new Response(html, {
        status: newResponse.status,
        statusText: newResponse.statusText,
        headers: new Headers(newResponse.headers)
      });
      htmlResponse.headers.set('cf-edge-cache', 'no-cache');
      htmlResponse.headers.set('content-type', 'text/html;charset=UTF-8');
      return htmlResponse;
    }

    const jsonResponse = new Response(json, {
      status: newResponse.status,
      statusText: newResponse.statusText,
      headers: new Headers(newResponse.headers)
    });
    jsonResponse.headers.set('cf-edge-cache', 'no-cache');
    jsonResponse.headers.set('content-type', 'application/json');
    return jsonResponse;
  },
};

