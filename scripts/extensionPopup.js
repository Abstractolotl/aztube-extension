let deviceDropdown = document.getElementById('device-select')
let closeDeviceWindow = document.getElementById('close-device-window')
let addDeviceWindow = document.getElementById('add-device-window')
let device = deviceDropdown.value
let tries = 0
let refreshTimer

deviceDropdown.addEventListener('change', () => {
  if (deviceDropdown.value === 'add') {
    deviceDropdown.value = device
    refreshTimer = window.setInterval(updateQRCode, 25000)
    updateQRCode()

    addDeviceWindow.hidden = false
  }
})

function updateQRCode() {
  if (tries >= 5) {
    stopAddDevice()

    return
  }
  tries++
  let div = document.getElementById('qrcode')
  div.innerHTML = ''

  let code = generateQRCode()
  console.log(code)
  {
    let c = code
    let timer = window.setInterval(() => {
      checkCode(c, timer)
    }, 500)
  }
  let qrcode = new QRCode(div, {
    text: code,
    width: 250,
    height: 250,
    colorDark: '#212121',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H
  })
  qrcode.hidden = true
}

function generateQRCode() {
  let response = JSON.parse(httpGet(`${Config.HOST}:${Config.PORT}/api/v1/qr/generate`))
  if (!response.success) {
    console.log('Error on /api/v1/qr/generate:')
    console.log(response.error)

    return
  }

  let uuid = response.uuid

  return uuid
}

function checkCode(code, timer) {
  let response = httpPost(`${Config.HOST}:${Config.PORT}/api/v1/qr/status`, `{ "code": "${code}" }`)
  if (!response || !response.success) {
    clearInterval(timer)

    return
  }
  if (response.status === 'registered' && response.browserToken && response.deviceName) {
    clearInterval(timer)

    addDevice(response.browserToken, response.deviceName)
    stopAddDevice()
  }
}

function stopAddDevice() {
  tries = 0
  addDeviceWindow.hidden = true
  clearInterval(refreshTimer)
  // to implement later
  console.log('stop add device')
}

function addDevice(browserToken, deviceName) {
  // to implement later
  console.log(`add device: browserToken: ${browserToken} deviceName:${deviceName}`)
}
