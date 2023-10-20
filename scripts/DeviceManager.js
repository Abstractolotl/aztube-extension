class DeviceManager {
  static getSelectedDevice() {
    let browserToken = localStorage.getItem('selectedDevice')
    let devices = this.getDevices()
    for (let device of devices) {
      if (device.browserToken === browserToken) {
        return device
      }
    }
    if (devices.length === 0) {
      return
    }
    localStorage.setItem('selectedDevice', devices[0])
    return devices[0]
  }

  static getSelection() {
    let browserToken = localStorage.getItem('selectedDevice')
    if (browserToken) return browserToken
    let devices = this.getDevices()
    if (devices && devices.length > 0) {
      let selection = devices[0].browserToken
      localStorage.setItem('selectedDevice', selection)
      return selection
    }
    return 'none'
  }

  static setSelectedDevice(browserToken) {
    localStorage.setItem('selectedDevice', browserToken)
  }

  static getDevices() {
    let devices = localStorage.getItem('devices')

    if (!devices) {
      devices = []
    } else {
      devices = JSON.parse(devices)
    }

    return devices
  }

  static addAndSelectDevice(browserToken, deviceName) {
    // push into device list
    let devices = localStorage.getItem('devices')

    if (!devices) {
      devices = []
    } else {
      devices = JSON.parse(devices)
    }

    devices.push({ browserToken: browserToken, deviceName: deviceName })
    localStorage.setItem('devices', JSON.stringify(devices))

    // select device
    localStorage.setItem('selectedDevice', browserToken)
  }

  static removeDevice(browserToken) {
    let devices = localStorage.getItem('devices')

    let selectedDevice = localStorage.getItem('selectedDevice')

    if (selectedDevice === browserToken) {
      localStorage.removeItem('selectedDevice')
    }

    if (!devices) {
      devices = []
    } else {
      devices = JSON.parse(devices)
    }

    let index = devices.findIndex((device) => device.browserToken === browserToken)
    devices.splice(index, 1)
    localStorage.setItem('devices', JSON.stringify(devices))
  }
}
