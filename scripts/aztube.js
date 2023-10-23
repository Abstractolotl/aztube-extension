export default class AztubeClient {

    constructor(serviceUrl) {
        this.serviceUrl = serviceUrl;
    }

    async generate() {
        let endpoint = this.serviceUrl + "/generate";
        let response = await (await fetch(endpoint)).json();
    
        return response;
    }

    async status(code) {
        let endpoint = this.serviceUrl + "/status";
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
    
    async download(browserToken, title, author, id, quality) {
        let endpoint = this.serviceUrl + "/download";
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
}