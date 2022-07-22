import './config.js';
import './lib/browser-polyfill.min.js';
import './util.js';
import './DeviceManager.js';

registerListener();

function registerListener(){
  browser.runtime.onMessage.addListener(
    async (data, sender) => {
      try{
        if (!(message.cmd === 'download')) {
          return 'unknown command';
        }
    
        let browserToken = DeviceManager.getSelection()
    
        if (!browserToken) {
          throw 'No device connected'
        }
    
        let videoDetails = data.video
      
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
        sendResponse(error);
      }
      sendResponse('no errors downloading')
      return 'done';
    }
  );
}