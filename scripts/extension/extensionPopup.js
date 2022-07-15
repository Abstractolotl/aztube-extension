let deviceDropdown = document.querySelector('.dropdown-menu')
let deviceSelection = document.getElementById('device-selection')
let closeDeviceWindow = document.getElementById('close-device-window')
let scanInfoTextWrapper = document.getElementById('scan-info-text-wrapper')
let qrCode = document.getElementById('qrcode')
let device = deviceSelection.value
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
  qrCode.innerText = ''

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
    correctLevel: QRCode.CorrectLevel.H
  })
}

function generateQRCode() {
  let response = JSON.parse(httpGet(`${Config.HOST}/generate`))
  if (!response.success) {
    console.log('Error on /generate:')
    console.log(response.error)

    return
  }

  let uuid = response.uuid

  return uuid
}

function checkCode(code, timer) {
  let response = httpPost(`${Config.HOST}/status`, `{ "code": "${code}" }`)
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
  qrCode.innerText = ''
  scanInfoTextWrapper.setAttribute('hidden', true)

  clearInterval(refreshTimer)
}

function addDevice(browserToken, deviceName) {
  console.log(`add device: browserToken: ${browserToken} deviceName: ${deviceName}`)
  DeviceManager.addAndSelectDevice(browserToken, deviceName)
  updateDevicesDropdown()
}

function updateDevicesDropdown() {
  deviceDropdown.innerText = ''

  let devices = DeviceManager.getDevices()
  let selectedDevice = DeviceManager.getSelectedDevice()

  if (!devices || devices.length === 0) {
    let noneElement = document.createElement('li')
    noneElement.id = 'none'
    deviceDropdown.appendChild(noneElement)
  } else {
    for (let device of devices) {
      let deviceElement = document.createElement('li')
      deviceElement.id = device.browserToken
      deviceElement.innerText = device.deviceName
      deviceDropdown.appendChild(deviceElement)
    }
  }

  $('.dropdown .dropdown-menu li').click(function () {
    $(this).parents('.dropdown').find('span').text($(this).text())
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'))
    localStorage.setItem('selectedDevice', $(this).attr('id'))
  })
  $('.dropdown-menu li').click(function () {
    var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
      msg = '<span class="msg">Hidden input value: '
    $('.msg').html(msg + input + '</span>')
  })

  if (!selectedDevice) {
    return
  }

  $('#device-selection').name = selectedDevice.browserToken
  $('.dropdown .select span').text(selectedDevice.deviceName)
}

updateDevicesDropdown()
