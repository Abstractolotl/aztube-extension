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

    httpPost(`${Config.HOST}:${Config.PORT}/download`, JSON.stringify(body))
    console.log('download triggered')
  } catch (error) {
    sendResponse(error)
    console.error(error)
  }
  sendResponse('no errors downloading')
})
