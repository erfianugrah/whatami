addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {

    let subrequest = new Request(request)
    // let str = "xff"
    // const xff = str.toUpperCase()
    // subrequest.headers.set("X-Forwarded-For", request.headers.get("cf-connecting-ip"))
    // subrequest.headers.set("subrequest-ray", request.headers.get("cf-ray"))
    // subrequest.headers.set("X-Real-IP", request.headers.get("cf-connecting-ip"))

    let newResponse = await fetch(subrequest)

    const requestHeaders = JSON.stringify(Object.fromEntries(subrequest.headers), null, 2)
    const responseHeaders = JSON.stringify(Object.fromEntries(newResponse.headers), null, 2)
    const cf = JSON.stringify((request.cf), null, 2)


    const data = [
        { request: Object.fromEntries(subrequest.headers) },
        { response: Object.fromEntries(newResponse.headers) },
        { cf: request.cf }
    ]

    const json = JSON.stringify(data)

    // Check if the request is coming from a browser
    const userAgent = request.headers.get('User-Agent')
    const isBrowser = userAgent && userAgent.includes('Mozilla')

    let html_style = "body {padding:6em; font-family: sans-serif;} h1 {color:#f6821f} h2 {color:#f6821f}"

    let list = ''

    // let html_content = [
    //     `IP: ${request.headers.get('cf-connecting-ip')}`,
    //     `ASN: ${request.cf.asn}`,
    //     `Colo: ${request.cf.colo}`,
    //     `Country: ${request.cf.country}`,
    //     `City: ${request.cf.city}`,
    //     `Continent: ${request.cf.continent}`,
    //     `Latitude: ${request.cf.latitude}`,
    //     `Longitude: ${request.cf.longitude}`,
    //     `Postal Code: ${request.cf.postalCode}`,
    //     `Metro Code: ${request.cf.metroCode}`,
    //     `Region: ${request.cf.region}`,
    //     `Region Code: ${request.cf.regionCode}`,
    //     `Time-zone: ${request.cf.timezone}`,
    //     `Device: ${request.headers.get("cf-device-type")}`
    // ]

    // html_content.forEach(function (param) {
    //     list += `<ul>${param}</ul>`
    // })

    let html =
        `<!DOCTYPE html>
        <body>  
            <head>
            <title> Print all</title>
            <style> ${html_style} </style>  
            </head>
    
        <h1>What am I?</h1>  
            <p>You now have access to your metadata.</p>  
                <ul>${list}</ul>
        <h2>Request Headers</h2>
            <pre>${requestHeaders}</pre>
        <h2>Response Headers</h2>
            <pre>${responseHeaders}</pre>
        <h2>cf Objects</h2>
            <pre>${cf}</pre>
        </body>`

    let htmlResponse = new Response(html, newResponse.body, newResponse)
    let jsonResponse = new Response(json, newResponse.body, newResponse)

    if (isBrowser) {

        htmlResponse.headers.set("cf-edge-cache", "no-cache")
        htmlResponse.headers.set("content-type", "text/html;charset=UTF-8")
        return htmlResponse

    } 
        jsonResponse.headers.set("cf-edge-cache", "no-cache")
        jsonResponse.headers.set("content-type", "application/json")
        return jsonResponse

}