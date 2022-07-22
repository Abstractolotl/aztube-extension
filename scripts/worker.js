import './config.js';
import './lib/browser-polyfill.min.js';
import './util.js';
import './DeviceManager.js';

browser.runtime.onMessage.addListener(
    async (data, sender) => {
      try{
        if (!(data.cmd === 'download')) {
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
        return error;
      }
      return 'done';
    }
  );