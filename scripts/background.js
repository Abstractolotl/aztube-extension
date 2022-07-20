import './config.js';
import './scripts/lib/browser-polyfill.min.js';
import './util.js';
import './DeviceManager.js';

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // TODO: change to Promise based way, as sendResponse is deprecated
    try {
      if (!(message.cmd === 'download')) {
        return
      }
  
      let browserToken = DeviceManager.getSelection()
  
      if (!browserToken) {
        throw 'No device connected'
      }
  
      let videoDetails = message.video
  
      let body = {
        browserToken: browserToken,
        title: videoDetails.title,
        author: videoDetails.author,
        videoId: videoDetails.videoId,
        quality: videoDetails.quality
      }
  
      let json = httpPost(`${Config.HOST}/download`, JSON.stringify(body))
  
      if (json.error === 'browserToken not Found') {
        DeviceManager.removeDevice(browserToken)
      }
    } catch (error) {
      sendResponse(error)
      console.error(error)
    }
    sendResponse('no errors downloading')
  })