function openDownloadWindow() {
  if (document.querySelector('.download-overlay')) {
    closeDownloadWindow()
    return
  }

  // Elements
  let overlay = document.createElement('div')
  let popup = document.createElement('div')
  let titleInput = document.createElement('input')
  let videoSelectionDropdown = document.createElement('select')

  overlay.addEventListener('click', closeDownloadWindow)

  // Classes
  overlay.classList.add('download-overlay')
  popup.classList.add('download-popup')
  titleInput.classList.add('download-title-input')
  videoSelectionDropdown.classList.add('download-video-selection-dropdown')

  // Appends
  document.body.appendChild(overlay)
  document.body.appendChild(popup)
  popup.appendChild(titleInput)
  popup.appendChild(videoSelectionDropdown)

  // Attributes
  titleInput.setAttribute('placeholder', 'Title')
  titleInput.setAttribute('label', 'Title')
  videoSelectionDropdown.setAttribute('placeholder', 'Video Selection')
  videoSelectionDropdown.setAttribute('label', 'Quality')

  // Dropdown stuff
  //Create array of options to be added
  let qualities = ['None (Audio only)', '480p', '720p', '1080p']

  //Create and append the options
  for (let i = 0; i < qualities.length; i++) {
    let option = document.createElement('option')
    option.value = qualities[i]
    option.text = qualities[i]
    videoSelectionDropdown.appendChild(option)
  }
}

function closeDownloadWindow() {
  document.querySelector('.download-overlay').remove()
  document.querySelector('.download-popup').remove()
}

function generateQRCode() {
  let response = httpGet(`${Config.HOST}:${Config.PORT}/generate`)
  if (!response.success) {
    console.log('Error on /generate:')
    console.log(response.error)
    return undefined
  }
  let uuid = response.code
  console.log(uuid)
}
