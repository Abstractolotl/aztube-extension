import { download, generate, status } from "./aztube.js";

const html = {
    videoThumbnail: document.querySelector("#aztube-video-thumbnail"),
    videoTitle: document.querySelector("#aztube-video-title"),
    videoAutor: document.querySelector("#aztube-video-author"),
    deviceDropdown: document.querySelector("#aztube-device-dropdown"),
    backArrow: document.querySelectorAll(".aztube-back"),
    qrCode: document.querySelector("#aztube-device-link-qr"),
    deleteDevice: document.querySelector("#aztube-delete-device"),
    sendButton: document.querySelector("#aztube-send"),
    qualityDropdown: document.querySelector("#aztube-quality")
}

function initDeviceLink() {
    html.backArrow.forEach((e) => {
        e.addEventListener("click", () => {
            setState("init");
        })
    
        html.qrCode.addEventListener("click", async () => {
            let response = await generate();
            let code = response.uuid;
            
            updateQrCode(code);       
            let interval = setInterval(async () => {
                if (await checkQrCode(code)) {
                    clearInterval(interval);
                    setState("init");
                }
            }, 500);
        })
    });
}

async function checkQrCode(code) {
    let response = await status(code);

    if (response.status == "registered") {
        html.qrCode.src = "res/qr_placeholder.svg";   
        const device = {
            browserToken: response.browserToken,
            deviceName: response.deviceName
        }

        let num = 0;
        while (existsWithName(device.deviceName)) {
            device.deviceName = response.deviceName + " (" + (num + 1) + ")";
            num++;
        }

        DeviceManager.addAndSelectDevice(device.browserToken, device.deviceName);
        addDeviceToDropdown(device)
        return true;
    }

    return false;
}

function existsWithName(deviceName) {
    let devices = DeviceManager.getDevices();
    for (const device of devices) {
        if (device.deviceName == deviceName) {
            return true;
        }
    }
    return false;
}

function updateQrCode(qr) {
    let dummy = document.createElement("div");
    new QRCode(dummy, {
        text: qr,
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
        html.qrCode.src = src
    };
    setTimeout(update, 10)
}

function setState(state) {
    document.body.setAttribute("state", state);
}

async function getVideoInfoFromUrl(url) {
    let endpoint = "https://noembed.com/embed?dataType=json&url=" + encodeURIComponent(url);
    let data = await (await fetch(endpoint)).json();
    return data;
}

function addDeviceToDropdown(device) {
    let selected = DeviceManager.getSelection();
    let option = document.createElement("option");
    option.value = device.browserToken;
    option.innerText = device.deviceName;
    
    html.deviceDropdown.insertBefore(option, html.deviceDropdown.firstChild);

    if (selected == device.browserToken) {
        option.selected = true;
    }
}

function removeDeviceFromDropdown(browserToken) {
    let options = html.deviceDropdown.querySelectorAll("option");
    for (const option of options) {
        if (option.value == browserToken) {
            option.remove();
        }
    }
}

function initDeviceDropdown() {
    let devices = DeviceManager.getDevices();
    
    for (const device of devices) {
        addDeviceToDropdown(device);
    }

    html.deviceDropdown.addEventListener("change", (e) => {
        console.log("change");
        if (e.target.value == "none") {
            setState("device-link");
            return;
        }
        DeviceManager.setSelectedDevice(html.deviceDropdown.value);
    })

    html.deviceDropdown.addEventListener("click", (e) => {
        if (e.target.value == "none" && DeviceManager.getDevices().length == 0) {
            setState("device-link");
        }
    })

    html.deleteDevice.addEventListener("click", () => {
        if (html.deviceDropdown.value == "none") return;

        let selected = DeviceManager.getSelection();
        DeviceManager.removeDevice(selected);
        removeDeviceFromDropdown(selected);

        if (html.deviceDropdown.value != "none") {
            DeviceManager.setSelectedDevice(html.deviceDropdown.value);
        }
    })
}

async function initDownloadTab() {
    let currentTab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
    let url = currentTab.url;

    let videoInfo = await getVideoInfoFromUrl(url);

    html.videoTitle.value = videoInfo.title;
    html.videoAutor.value = videoInfo.author_name;
    html.videoThumbnail.src = videoInfo.thumbnail_url;

    html.sendButton.addEventListener("click", () => {
        let device = DeviceManager.getSelectedDevice();

        if (!device) {
            setState("device-link");
            return;
        }
        
        const videoId = new URL(videoInfo.url).searchParams.get("v");
        download(device.browserToken, 
            html.videoTitle.value, 
            html.videoAutor.value, 
            videoId, 
            html.qualityDropdown.value
        );

        setState("sent");
    });
}

initDownloadTab();
initDeviceDropdown();
initDeviceLink();

if (DeviceManager.getDevices().length == 0) {
    setState("device-link");
} else {
    setState("init");
}