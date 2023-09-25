class Devices {
  constructor({ selectEl, getUserMediaSuccess, getUserMediaError, constraints }) {
    this.element = selectEl
    this.getUserMediaSuccess = typeof getUserMediaSuccess === "function" ? getUserMediaSuccess : () => {}
    this.getUserMediaError = typeof getUserMediaError === "function" ? getUserMediaError : () => {}
    this.constraints = constraints
    this.deviceId = null
    this.init()
  }

  init() {
    // check if the element is a select component
    if (!this.element.tagName === "SELECT") {
      this.consoleError("The element within the Devices constructor must be a SELECT")
      return
    }
    // try to get the list of devices which are cameras
    if (!navigator.mediaDevices?.enumerateDevices) {
      this.consoleError("EnumarateDevices not supported")
    } else {
      // get the list and insert it into the element which is a select
      navigator.mediaDevices
        .enumerateDevices()
        .then(async (devices) => {
          // set the first device which has the videoinput as the default device
          this.deviceId = devices.find((device) => device.kind === "videoinput").deviceId

          devices.forEach((device) => {
            if (device.kind === "videoinput") {
              const option = document.createElement("option")
              option.value = device.deviceId
              option.text = device.label || `Camera ${device.deviceId}`
              this.element.appendChild(option)
            }
          })

          // start  video
          this.#startVideo()
        })
        .catch((err) => {
          this.consoleError(`${err.name}: ${err.message}`)
        })
    }
  }

  #startVideo() {
    const constraints = {
      video: {
        ...this.constraints.video,
        deviceId: this.deviceId,
      },
    }
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => this.getUserMediaSuccess(stream))
      .catch((error) => {
        this.consoleError("Camera access denied by the user.")
        this.getUserMediaError(error)
      })
  }

  onChange(fn = (event) => {}) {
    this.element.addEventListener("change", (event) => {
      this.deviceId = event.target.value
      fn(event)
      this.#startVideo()
    })
  }

  consoleError(message) {
    const consoleErrorStyle = "color: red; font-size: 1.2rem; font-weight: bold;"
    console.error(`%c${message}`, consoleErrorStyle)
  }
}
