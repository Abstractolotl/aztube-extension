function readUrl(url) {
  let para_str = ''
  let parts

  // Checking url is defined or not
  if (url == undefined) {
    // url variable is not defined
    // get url parameters
    url = location.search // e.g. ?num1=43&num2=23
    parts = url.substring(1).split('&')
    para_str = parts[0]
  } else {
    // url variable is defined
    let split_url = url.split('?')
    para_str = split_url[1]
    if (para_str != undefined) {
      parts = para_str.split('&')
    }
  }

  // Check arguments are defined or not
  if (para_str != undefined && para_str != '') {
    let parameter_obj = {} // Object

    // looping through all arguments and store in Object
    for (let i = 0; i < parts.length; i++) {
      let split_val = parts[i].split('=')

      // Check argument is available or not e.g. ?num1=43&
      if (split_val[0] == undefined || split_val[0] == '') continue
      let value = split_val[1]
      // Check value is available or not e.g. ?num1=43&num2= or ?num1=43&num2
      if (value == undefined) {
        value = '' // Assign space if value is not defined
      }

      parameter_obj[split_val[0]] = value
    }
    return parameter_obj
  } else {
    return {}
  }
}

function createDownloadButton() {}

function createElementFromHTML(htmlString) {
  var div = document.createElement('div')
  div.innerHTML = htmlString.trim()

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild
}

function htmlToElement(html) {
  var template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

function httpGet(url) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.open('GET', url, false) // false for synchronous request
  xmlHttp.send(null)
  return xmlHttp.responseText
}
