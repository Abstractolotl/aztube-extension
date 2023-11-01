export default class ExtensionPopup {

    /**
     * @param {{
     *      statefulContainer: HTMLButtonElement,
     *      qrCode: HTMLImageElement,
     *      videoTitle: HTMLHeadingElement,
     *      videoAuthor: HTMLHeadingElement,
     *      videoThumbnail: HTMLImageElement,
     *      deviceDropdown: HTMLSelectElement,
     *      sendButton: HTMLButtonElement,
     *      backArrows: NodeListOf<HTMLButtonElement>,
     *      qualityDropdown: HTMLSelectElement,
     *      deleteDevice: HTMLButtonElement,
     *      errorText: HTMLParagraphElement,
     * }} htmlElements 
     * @param {{
     *     send: () => void,
     * }} callbacks
     */
    constructor(htmlElements, callbacks) {
        this.htmlElements = htmlElements;
        this.callbacks = callbacks;

        console.log(this);
        this._initCallbacks();
    }

    _initCallbacks() {
        this.htmlElements.sendButton.addEventListener("click", () => {
            const title = this.htmlElements.videoTitle.value;
            const author = this.htmlElements.videoAuthor.value;
            const quality = this.htmlElements.qualityDropdown.value;
            this.callbacks.send(title, author, quality);
        });
        this.htmlElements.deviceDropdown.addEventListener("change", (e) => {
            this.callbacks.changeSelectedDevice(e.target.value);
        });
        this.htmlElements.deleteDevice.addEventListener("click", () => {
            const currentToken = this.htmlElements.deviceDropdown.value;
            this.callbacks.deleteDevice(currentToken);
        });
        this.htmlElements.qrCode.addEventListener("click", () => {
            this.callbacks.generateQrCode();
        });

        this.htmlElements.backArrows.forEach((e) => e.addEventListener("click", this.navigateHome.bind(this)));
        this.htmlElements.deviceDropdown.addEventListener("click", (e) => {
            if (e.target.value == "none" && DeviceManager.getDevices().length == 0) {
                this.navigateDeviceLink();
            }
        })
    }

    navigateHome() {
        this._setState("init");
    }

    navigateDeviceLink() {
        this._setState("device-link");
    }

    navigateSent() {
        this._setState("sent");
    }

    _setState(state) {
        this.htmlElements.statefulContainer.setAttribute("state", state);
        this.showError("");
    }

    addDeviceToDropdown(device) {
        let option = document.createElement("option");
        option.innerText = device.deviceName;
        option.value = device.browserToken;
        option.selected = true;

        const first = this.htmlElements.deviceDropdown.firstChild;
        this.htmlElements.deviceDropdown.insertBefore(option, first);
    }

    removeDeviceFromDropdown(browserToken) {
        let options = this.htmlElements.deviceDropdown.querySelectorAll("option");
        for (const option of options) {
            if (option.value == browserToken) {
                option.remove();
            }
        }
    }

    resetQrImage() {
        this.htmlElements.qrCode.src = "res/qr_placeholder.svg";
    }

    showQrImage(code) {
        let dummy = document.createElement("div");
        new QRCode(dummy, {
            text: code,
            width: 250,
            height: 250,
            colorDark: '#212121',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
        let counter = 0;
        const update = () => {
            let src = dummy.querySelector("img").src;
            if (!src && counter < 10) {
                counter++;
                setTimeout(update, 100)
                return
            }
            this.htmlElements.qrCode.src = src;
        };
        this.htmlElements
        setTimeout(update, 10)
    }

    showError(text) {
        this.htmlElements.errorText.innerText = text;
    }

    showVideoInfo(videoInfo) {
        this.htmlElements.videoTitle.value = videoInfo.title;
        this.htmlElements.videoAuthor.value = videoInfo.author_name;
        this.htmlElements.videoThumbnail.src = videoInfo.thumbnail_url;
    }

}