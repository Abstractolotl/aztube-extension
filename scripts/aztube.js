const aztubeApi = "http://frieren.abstractolotl.de:9000";

export async function generate() {
    let endpoint = aztubeApi + "/generate";
    let response = await (await fetch(endpoint)).json();

    return response;
}

export async function status(code) {
    let endpoint = aztubeApi + "/status";
    let response = await (await fetch(endpoint, {
        body: JSON.stringify({
            code
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })).json();

    return response;
}

export async function download(browserToken, title, author, id, quality) {
    let endpoint = aztubeApi + "/download";
    let response = await (await fetch(endpoint, {
        body: JSON.stringify({
            browserToken,
            title,
            author,
            videoId: id,
            quality
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })).json();

    return response;
}