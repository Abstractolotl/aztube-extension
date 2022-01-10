window.addEventListener('yt-navigate-finish', function (event) {
  let checkIfLoaded = () => {
    if (
      document.querySelector(
        '#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed'
      )
    ) {
      onLoaded()
    } else {
      console.log('checking again')
      setTimeout(checkIfLoaded, 5)
    }
  }
  checkIfLoaded()
})

function onLoaded() {
  console.log('Done Loading Page!')
  let url_parameter = readUrl()

  let videoInformation = {
    videoId: url_parameter['v']
  }

  console.log(videoInformation)

  /* let specialBtn = document.createElement('ytd-button-renderer')
  ButtonStuff.test()
  specialBtn.innerHTML = ButtonStuff.innerHTML
  specialBtn.classList = ButtonStuff.classList */

  // it works
  /*
  let btn = document.createElement('div')
  btn.id = 'aztube-download-btn-wrapper'
  //btn.innerHTML = `<div id="aztube-download-btn" class="style-scope ytd-button-renderer">`
  btn.innerHTML = buttonInnerHTML
  */

  let buttonInnerHTML = `<a class="yt-simple-endpoint style-scope ytd-download-button-renderer" tabindex="-1">
  <yt-icon-button id="button" class="style-scope ytd-download-button-renderer style-default size-default" touch-feedback="">
    <!--css-build:shady-->
    <button id="button" class="style-scope yt-icon-button" aria-label="Herunterladen">
        <yt-icon class="style-scope ytd-download-button-renderer">
          <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;">
              <g class="style-scope yt-icon">
                <path d="M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z" class="style-scope yt-icon">
                </path>
              </g>
          </svg>
          <!--css-build:shady-->
        </yt-icon>
    </button>
    <yt-interaction id="interaction" class="circular style-scope yt-icon-button">
        <!--css-build:shady-->
        <div class="stroke style-scope yt-interaction"></div>
        <div class="fill style-scope yt-interaction"></div>
    </yt-interaction>
  </yt-icon-button>
  <yt-formatted-string id="text" class="style-scope ytd-download-button-renderer style-default size-default">Herunterladen</yt-formatted-string>
  <tp-yt-paper-tooltip class="style-scope ytd-download-button-renderer" role="tooltip" tabindex="-1" style="inset: 44px auto auto 365.656px;">
    <!--css-build:shady-->
    <div id="tooltip" class="style-scope tp-yt-paper-tooltip hidden">
        Herunterladen
    </div>
  </tp-yt-paper-tooltip>
</a>`

  // -------------------------------------------

  let btn = document.createElement('button')
  btn.id = 'aztube-download-btn'
  btn.innerHTML = buttonInnerHTML

  // -------------------------------------------

  // actually working btw xD
  console.log(
    document.querySelector(
      '#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed'
    )
  )

  document
    .querySelector('#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed')
    .appendChild(btn)

  let buttonContainer = document.querySelector(
    '#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed'
  )

  // atm this only works when not logged in (it kinda hijacks the original download button that is hidden, does not exist when logged in tho)
  let downloadButton = document.querySelector(
    '#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed > ytd-download-button-renderer'
  )
  //downloadButton.removeAttribute('is-hidden')
  //downloadButton.addEventListener('click', () => {
  //  console.log('CLICK DOWNLOAD')
  //})

  /*let button = buttonContainer.lastChild
  console.log(button)
  buttonContainer.appendChild(button)*/

  //buttonContainer.innerHTML = buttonContainer.innerHTML.replace('DISLIKE', 'Schlumpf')

  //console.log(createDownloadButton())
  //console.log(btn)
}
