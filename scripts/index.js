window.addEventListener('yt-navigate-finish', function (event) {
  let checkIfLoaded = () => {
    if (document.querySelector('#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed')) {
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

  let btn = document.createElement('button')
  btn.id = 'aztube-download-btn'
  btn.classList.add('style-scope', 'ytd-menu-renderer', 'style-default', 'size-default', 'force-icon-button')
  btn.innerHTML =
    '<svg id="svg-download-button" style="color: white;" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="yt-icon"><g class="style-scope yt-icon"><path d="M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z" class="style-scope yt-icon"></path></g></svg>'
  btn.setAttribute('button-renderer', 'true')

  document.querySelector('#menu-container > #menu > ytd-menu-renderer > #top-level-buttons-computed').appendChild(btn)

  btn.addEventListener('click', openDownloadWindow)
}
