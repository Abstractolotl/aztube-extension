function openDownloadWindow() {
  if (document.querySelector('.download-overlay')) {
    closeDownloadWindow()
    return
  }

  // Elements
  let overlay = document.createElement('div')
  let popup = document.createElement('div')
  let titleInput = document.createElement('input')
  let fileExtensionLabel = document.createElement('label')
  let videoSelectionDropdown = document.createElement('select')
  let sendButton = document.createElement('button')

  overlay.addEventListener('click', closeDownloadWindow)
  videoSelectionDropdown.addEventListener('change', updateTitleLabel)

  // Classes
  overlay.classList.add('download-overlay')
  popup.classList.add('download-popup')
  titleInput.classList.add('download-title-input')
  fileExtensionLabel.classList.add('download-file-extension-label')
  videoSelectionDropdown.classList.add('download-video-selection-dropdown')
  sendButton.classList.add('send-button')

  // Appends
  document.body.appendChild(overlay)
  document.body.appendChild(popup)
  popup.appendChild(titleInput)
  popup.appendChild(fileExtensionLabel)
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

  // Dropdown stuff
  //Create array of options to be added
  let qualities = ['Audio', '480p', '720p', '1080p']

  //Create and append the options
  for (let i = 0; i < qualities.length; i++) {
    let option = document.createElement('option')
    option.value = qualities[i]
    option.text = qualities[i]
    option.id = 'select-option'
    videoSelectionDropdown.appendChild(option)
  }

  updateTitleLabel()

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

function updateTitleLabel() {
  let videoSelectionDropdown = document.querySelector('.download-video-selection-dropdown')
  let fileExtensionLabel = document.querySelector('.download-file-extension-label')
  let quality = videoSelectionDropdown.value
  if (quality === 'Audio') {
    fileExtensionLabel.innerText = '.mp3'
  } else {
    fileExtensionLabel.innerText = '.mp4'
  }
}

function generateDownload() {
  let url_parameter = readUrl()

  let title = document.getElementById('titleInput').value
  let quality = document.getElementById('videoSelectionDropdown').value

  if (quality === 'None (Audio only)') {
    quality = 'audio'
  }

  return {
    videoId: url_parameter['v'],
    title: title,
    quality: quality,
  }
}

function hasInvalidCharacters(str) {
  return /[\\\/:*?"<>|]/.test(str)
}

function removeInvalidCharacters(str) {
  return str.replace(/[\\\/:*?"<>|]/g, '')
}
