import AztubeClient from "./aztube.js";
import ExtensionPopup from "./extension.js";

const popupHtml = {
    statefulContainer: document.body,
    videoThumbnail: document.querySelector("#aztube-video-thumbnail"),
    videoTitle: document.querySelector("#aztube-video-title"),
    videoAuthor: document.querySelector("#aztube-video-author"),
    deviceDropdown: document.querySelector("#aztube-device-dropdown"),
    backArrows: document.querySelectorAll(".aztube-back"),
    sendButton: document.querySelector("#aztube-send"),
    qualityDropdown: document.querySelector("#aztube-quality"),
    deleteDevice: document.querySelector("#aztube-delete-device"),
    qrCode: document.querySelector("#aztube-device-link-qr"),
    errorText: document.querySelector("#aztube-error"),
};


const client = new AztubeClient("http://frieren.abstractolotl.de:9000");
const callbacks = {addEventListener: (e, f) => callbacks[e] = f};
const popup = new ExtensionPopup(popupHtml, callbacks);

async function init() {
    callbacks.addEventListener("send", onSend);
    callbacks.addEventListener("changeSelectedDevice", onChangeSelectedDevice);
    callbacks.addEventListener("deleteDevice", onDeleteDevice);
    callbacks.addEventListener("generateQrCode", onGenerateQrCode);

    loadDevices();
    loadCurrentVideoInfo();
}

async function onSend(title, author, quality) {
    const device = DeviceManager.getSelectedDevice();
    if (!device || device === "none") {
        popup.navigateDeviceLink();
        popup.showError("No device selected. Please register a device first.");
        return;
    }

    const id = new URL(await getCurrentUrl()).searchParams.get("v");

    try {
        client.download(device.browserToken, title, author, id, quality);
    } catch (e) {
        popup.showError("Failed to send video to device.");
        console.error(e);
    }
}

async function onDeleteDevice(token) {
    if (token === "none") {
        return;
    }

    DeviceManager.removeDevice(token);
    popup.removeDeviceFromDropdown(token);
}

function onChangeSelectedDevice(e) {
    if (e === "none") {
        popup.navigateDeviceLink();
    }

    DeviceManager.setSelectedDevice(e);
}

function onGenerateQrCode() {
    startDeviceLinkFlow();
}

function loadDevices() {
    let devices = DeviceManager.getDevices();
    for (const device of devices) {
        popup.addDeviceToDropdown(device);
    }
}

async function loadCurrentVideoInfo() {
    const videoInfo = await getVideoInfoFromUrl(await getCurrentUrl());
    popup.showVideoInfo(videoInfo);
}

async function startDeviceLinkFlow() {
    let response;
    try {
        response = await client.generate();
    } catch (e) {
        popup.showError("Failed to generate device link token. Service may be offline.");
        console.error(e);
        return;
    }
    let code = response.uuid;

    popup.showQrImage(code);
    let device;
    try {
        device = await checkDeviceLinkToken(code);
    } catch (e) {
        if (e) {
            popup.showError("Failed to register device.");
            console.error(e);
        } else {
            popup.showError("Device link token expired. Please try again.");
        }
        popup.resetQrImage();
        return;
    }
    registerDevice(device);
    popup.navigateHome();
}

function checkDeviceLinkToken(code) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
            let response;
            try {
                response = await client.status(code);
            } catch (e) {
                reject(e);
                clearInterval(interval);
            }
            console.log(response);
    
            if (response.status == "registered") {
                popup.resetQrImage();
    
                const device = {
                    browserToken: response.browserToken,
                    deviceName: response.deviceName
                }
                resolve(device);
                clearInterval(interval);
            } else if (response.status != "generated") {
                reject(false);
                clearInterval(interval);
            }
        }, 500);
    });
}

function registerDevice(device) {
    let num = 0;
    while (existsWithName(device.deviceName)) {
        device.deviceName = response.deviceName + " (" + (num + 1) + ")";
        num++;
    }

    DeviceManager.addAndSelectDevice(device.browserToken, device.deviceName);
    popup.addDeviceToDropdown(device);
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

async function getVideoInfoFromUrl(url) {
    let endpoint = "https://noembed.com/embed?dataType=json&url=" + encodeURIComponent(url);
    let data = await (await fetch(endpoint)).json();
    return data;
}

async function getCurrentUrl() {
    if (chrome && chrome.tabs) {
        let currentTab = (await chrome.tabs.query({active: true, currentWindow: true}))[0];
        return currentTab.url;
    }

    return "https://www.youtube.com/watch?v=Jv2uxzhPFl4";
}

init();