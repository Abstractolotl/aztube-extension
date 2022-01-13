let sleep = ms => new Promise(r => setTimeout(r, ms))

async function openDownloadWindow() {
  if (document.querySelector('.download-overlay')) {
    closeDownloadWindow()
    return
  }

  // Elements
  let overlay = document.createElement('div')
  let popup = document.createElement('div')
  let titleInput = document.createElement('input')
  let videoSelectionDropdown = document.createElement('select')
  let sendButton = document.createElement('button')

  overlay.addEventListener('click', closeDownloadWindow)

  // Classes
  overlay.classList.add('download-overlay')
  popup.classList.add('download-popup')
  titleInput.classList.add('download-title-input')
  videoSelectionDropdown.classList.add('download-video-selection-dropdown')
  sendButton.classList.add('send-button')

  // Appends
  document.body.appendChild(overlay)
  document.body.appendChild(popup)
  popup.appendChild(titleInput)
  popup.appendChild(videoSelectionDropdown)
  popup.appendChild(sendButton)

  // Attributes
  titleInput.setAttribute('placeholder', 'Title')
  titleInput.setAttribute('label', 'Title')
  titleInput.id = 'titleInput'
  videoSelectionDropdown.setAttribute('placeholder', 'Video Selection')
  videoSelectionDropdown.id = 'videoSelectionDropdown'
  videoSelectionDropdown.setAttribute('label', 'Quality')
  sendButton.innerHTML = 'Send'
  sendButton.onclick = generateDownload

  let settingsButton = document.getElementsByClassName("ytp-settings-button")[0]
  settingsButton.click()

  await sleep(50)

  let qualityMenu = document.getElementsByClassName("ytp-panel-menu")[0].lastChild
  qualityMenu.click()

  await sleep(50)

  let qualityOptions = [...document.getElementsByClassName("ytp-menuitem")]

  // Dropdown stuff
  //Create array of options to be added
  let qualities = [
    { text: 'Audio', value: 'audio' }
  ]

  let allowedQualities = [
    "144p",
    "240p",
    "360p",
    "480p",
    "720p",
    "720p60",
    "1080p",
    "1080p60",
    "1440p",
    "1440p60",
    "2160p",
    "2160p60"
  ]

  qualityOptions.forEach((item) => {
    let resolution = item.innerText

    let cleanResolution = resolution.replace(' HD', '').replace(' 4K', '').replace(' 8K', '')

    allowedQualities.forEach((allowedQuality) => {
      if(allowedQuality === cleanResolution){
        qualities.push({ text: resolution, value: cleanResolution })
      }
    })
  })

  console.log(qualities)

  //Create and append the options
  for (let i = 0; i < qualities.length; i++) {
    let option = document.createElement('option')
    option.value = qualities[i].value
    option.text = qualities[i].text
    option.id = 'select-option'
    videoSelectionDropdown.appendChild(option)
  }

  titleInput.value = document.querySelector('#container > h1 > yt-formatted-string').innerText

  if (hasInvalidCharacters(titleInput.value)) {
    titleInput.value = removeInvalidCharacters(titleInput.value)

    let tooltip = document.createElement('div')
    tooltip.classList.add('tooltip')
    tooltip.innerHTML = 'Invalid characters in title'
    titleInput.appendChild(tooltip)
  }
}

function closeDownloadWindow() {
  document.querySelector('.download-overlay').remove()
  document.querySelector('.download-popup').remove()
}

function generateDownload() {
  let url_parameter = readUrl()

  let title = document.getElementById('titleInput').value
  let quality = document.getElementById('videoSelectionDropdown').value

  if (quality === 'None (Audio only)') {
    quality = 'audio'
  }

  let videoDetails = {
    videoId: url_parameter['v'],
    title: title,
    quality: quality,
  }

  let message = {
    cmd: 'download',
    video: videoDetails,
  }

  console.log('sent Download instruction')

  browser.runtime.sendMessage(message).then((response) => {
    // displayErrorToast(response)
    console.log(response)
  })
}

function hasInvalidCharacters(str) {
  return /[\\\/:*?"<>|]/.test(str)
}

function removeInvalidCharacters(str) {
  return str.replace(/[\\\/:*?"<>|]/g, '')
}
