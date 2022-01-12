let deviceDropdown = document.getElementById('device-select')
let closeDeviceWindow = document.getElementById('close-device-window')
let addDeviceWindow = document.getElementById('add-device-window')
let device = deviceDropdown.value
let timer

deviceDropdown.addEventListener('change', () => {
  if (deviceDropdown.value === 'add') {
    deviceDropdown.value = device
    timer = window.setInterval(updateQRCode, 25000)
    updateQRCode()

    addDeviceWindow.hidden = false
  }
})

closeDeviceWindow.addEventListener('click', () => {
  addDeviceWindow.hidden = true
  clearInterval(timer)
})

function updateQRCode() {
  let div = document.getElementById('qrcode')
  div.innerHTML = ''

  let code = generateQRCode()
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
  console.log(response)
  if (!response.success) {
    console.log('Error on /api/v1/qr/generate:')
    console.log(response.error)

    return
  }

  let uuid = response.uuid

  return uuid
}
