let sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function openDownloadWindow() {
  if (document.querySelector('.download-overlay')) {
    closeDownloadWindow()
    return
  }

  // Elements
  let overlay = document.createElement('div')
  let popup = document.createElement('div')

  overlay.addEventListener('click', closeDownloadWindow)

  // Classes
  overlay.classList.add('download-overlay')
  popup.classList.add('download-popup')

  // Appends
  document.body.appendChild(overlay)
  document.body.appendChild(popup)
  popup.innerHTML = "<h1 style=\"color: white; font-weight: 400;\">AzTube</h1> <div class=\"az-input\"> <label>Titel</label><input id=\"az-input-title\"/> </div> <div class=\"az-input\"> <label >Author</label><input id=\"az-input-author\" /> </div> <div class=\"az-input az-nofocus\"> <div id=\"az-btn-video\" class=\"az-dropdown az-video\" > <span id=\"az-btn-video-label\">Video</span> <div class=\"az-dropdown-content\"></div> </div><button id=\"az-btn-audio\" class=\"az-btn az-pressed\">Audio</button> </div> <div> <button id=\"az-btn-send\" class=\"az-btn az-send\">Send!</button> </div>"
  
  const inpTitle = document.getElementById("az-input-title");
  const inpAuthor = document.getElementById("az-input-author");
  const btnSend = document.getElementById("az-btn-send");
  const btnAudio = document.getElementById("az-btn-audio");
  const btnVideo = document.getElementById("az-btn-video")
  const btnVideoDropdown = btnVideo.children[1];
  const btnVideoLabel = btnVideo.children[0];

  btnSend.addEventListener("click", () => {
    generateDownload(inpTitle.value, selectedQuality.value, inpAuthor.value);
  })

  //grabbing qualites
  let settingsButton = document.getElementsByClassName('ytp-settings-button')[0]
  settingsButton.click()
  await sleep(50)
  let qualityMenu = document.getElementsByClassName('ytp-panel-menu')[0].lastChild
  qualityMenu.click()
  await sleep(50)
  let qualityOptions = [...document.getElementsByClassName('ytp-menuitem')]

  // Dropdown stuff
  //Create array of options to be added
  let qualities = []
  let allowedQualities = ['144p', '240p', '360p', '480p', '720p', '720p60', '1080p', '1080p60', '1440p', '1440p60', '2160p', '2160p60']
  qualityOptions.forEach((item) => {
    let resolution = item.innerText

    let cleanResolution = resolution.replace(' HD', '').replace(' 4K', '').replace(' 8K', '')

    allowedQualities.forEach((allowedQuality) => {
      if (allowedQuality === cleanResolution) {
        qualities.push({ text: resolution, value: cleanResolution })
      }
    })
  })


  let selectedQuality = {text:"Audio", value:"audio"};

  for(const q of qualities) {
    const span = document.createElement("span");
    span.innerHTML = q.text;
    span.addEventListener("click", (e) => {
      selectedQuality = q;
      btnVideo.quality = q;

      btnVideoLabel.innerHTML = "Video (" + q.text + ")";
      btnAudio.classList.remove("az-pressed");
      btnVideo.classList.add("az-pressed");
      btnVideo.classList.remove("az-dropdown");
      setTimeout(() => {
          btnVideo.classList.add("az-dropdown");
      }, 1)
    })
    btnVideoDropdown.appendChild(span);
  }

  btnAudio.addEventListener("click", () => {
    btnAudio.classList.add("az-pressed");
    btnVideo.classList.remove("az-pressed");

    selectedQuality = {text:"Audio", value:"audio"};
  })

  btnVideo.addEventListener("click", () => {
    selectedQuality = btnVideo.quality ? btnVideo.quality : qualities[0];
    btnAudio.classList.remove("az-pressed");
    btnVideo.classList.add("az-pressed");
  });
  

  btnVideo.quality = qualities.find(q => q.value == "1080p") ?? qualities[0];
  btnVideoLabel.innerHTML = "Video (" + btnVideo.quality.text + ")";

  inpTitle.value = document.querySelector('#container > h1 > yt-formatted-string').innerText
  inpAuthor.value = document.querySelector('#text > a').innerText
}

function closeDownloadWindow() {
  document.querySelector('.download-overlay').remove()
  document.querySelector('.download-popup').remove()
}

function generateDownload(title, quality, author) {
  let url_parameter = readUrl()

  if (quality === 'None (Audio only)') {
    quality = 'audio'
  }

  let videoDetails = {
    videoId: url_parameter['v'],
    title: title,
    quality: quality,
    author: author
  }

  let message = {
    cmd: 'download',
    video: videoDetails
  }

  console.log(message);
  browser.runtime.sendMessage(message).then((response) => {
    // displayErrorToast(response)
    console.log(response)
  })

  closeDownloadWindow()
}

function hasInvalidCharacters(str) {
  return /[\\\/:*?"<>|]/.test(str)
}

function removeInvalidCharacters(str) {
  return str.replace(/[\\\/:*?"<>|]/g, '')
}
