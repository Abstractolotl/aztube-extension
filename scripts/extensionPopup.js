let deviceDropdown = document.getElementById('device-select')
let closeDeviceWindow = document.getElementById('close-device-window')
let scanInfoTextWrapper = document.getElementById('scan-info-text-wrapper')
let qrCode = document.getElementById('qrcode')
let device = deviceDropdown.value
let tries = 0
let refreshTimer

qrCode.addEventListener('click', () => {
  window.clearInterval(refreshTimer)
  refreshTimer = window.setInterval(updateQRCode, 25000)
  scanInfoTextWrapper.removeAttribute('hidden')
  updateQRCode()
})

function updateQRCode() {
  if (tries >= 5) {
    stopAddDevice()

    return
  }
  tries++
  qrCode.innerHTML = ''

  let code = generateQRCode()
  console.log(code)
  {
    let c = code
    let timer = window.setInterval(() => {
      checkCode(c, timer)
    }, 500)
  }
  new QRCode(qrCode, {
    text: code,
    width: 250,
    height: 250,
    colorDark: '#212121',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.H,
  })
}

function generateQRCode() {
  let response = JSON.parse(httpGet(`${Config.HOST}:${Config.PORT}/generate`))
  if (!response.success) {
    console.log('Error on /generate:')
    console.log(response.error)

    return
  }

  let uuid = response.uuid

  return uuid
}

function checkCode(code, timer) {
  let response = httpPost(`${Config.HOST}:${Config.PORT}/status`, `{ "code": "${code}" }`)
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
  qrCode.innerHTML = ''
  scanInfoTextWrapper.setAttribute('hidden', true)

  clearInterval(refreshTimer)
}

function addDevice(browserToken, deviceName) {
  console.log(`add device: browserToken: ${browserToken} deviceName:${deviceName}`)
  DeviceManager.addAndSelectDevice(browserToken, deviceName)
  updateDevicesDropdown()
}

function updateDevicesDropdown() {
  deviceDropdown.innerHTML = ''

  let devices = DeviceManager.getDevices()
  let selection = DeviceManager.getSelection()
  if (!devices || devices.length === 0) {
    let noneElement = document.createElement('option')
    noneElement.value = 'none'
    deviceDropdown.appendChild(noneElement)
  } else {
    for (let device of devices) {
      let deviceElement = document.createElement('option')
      deviceElement.value = device.browserToken
      deviceElement.innerHTML = device.deviceName
      deviceDropdown.appendChild(deviceElement)
    }
  }
  deviceDropdown.value = selection
}

updateDevicesDropdown()
