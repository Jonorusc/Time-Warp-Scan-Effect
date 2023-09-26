class TimeWarp {
  constructor({ lineWidth, lineColour, speed, videoCanvas, videoCtx, video, imageCanvas, imageCtx }) {
    if (videoCanvas.tagName !== "CANVAS" || imageCanvas.tagName !== "CANVAS") {
      throw new Error("VideoCanvas and ImageCanvas must be a canvas component")
    }

    this.videoCanvas = videoCanvas
    this.videoCtx = videoCtx
    this.video = video
    this.imageCanvas = imageCanvas
    this.imageCtx = imageCtx
    this.lineWidth = lineWidth // Width of the line
    this.lineColour = lineColour
    this.speed = speed // Speed of the line in pixels per frame
    // native properties
    this.linePos = 0 // Current position of the line
    this.imageChunks = [] // Array to store the generated image chunks - {imgData: ImageData, height: number}[]
    this.animationId = null // ID of the animation frame - null | number

    // Bind animate method to the class instance
    this.animate = this.animate.bind(this)
  }

  animate() {
    this.videoCtx.save() // Save the current canvas state
    this.videoCtx.scale(-1, 1) // Invert horizontally (mirror effect)
    this.videoCtx.drawImage(this.video, -this.videoCanvas.width, 0) // Draw the inverted video
    this.videoCtx.restore() // Restore the canvas state
    // draws the result image onto the image canvas
    this.imageChunks.forEach((chunk) => {
      this.imageCtx.putImageData(chunk.imgData, 0, chunk.height)
    })
    // Draws the line
    this.videoCtx.beginPath()
    this.videoCtx.lineWidth = this.lineWidth
    this.videoCtx.strokeStyle = this.lineColour
    this.videoCtx.moveTo(0, this.linePos)
    this.videoCtx.lineTo(this.videoCanvas.width, this.linePos)
    this.videoCtx.stroke()

    const chunkHeight = 0.5 + this.lineWidth // Set chunkHeight to 1/2 pixel
    // Generate the image chunk every of the video height
    if (this.linePos % chunkHeight <= this.speed) {
      const currentChunkIndex = Math.floor(this.linePos / chunkHeight)
      const imgData = ctx.getImageData(0, currentChunkIndex * chunkHeight + this.lineWidth, this.videoCanvas.width, chunkHeight)
      this.imageChunks.push({ imgData, height: this.linePos - chunkHeight + this.lineWidth })
    }

    // Move the line down
    this.linePos += this.speed
    // Check if animation is finished
    if (this.linePos >= this.videoCanvas.height + this.lineWidth) cancelAnimationFrame(this.animationId)
    else this.animationId = requestAnimationFrame(this.animate)
  }

  reset() {
    // Reset animation
    cancelAnimationFrame(this.animationId)
    this.videoCtx.clearRect(0, 0, this.videoCanvas.width, this.videoCanvas.height)
    this.imageCtx.clearRect(0, 0, this.videoCanvas.width, this.videoCanvas.height)
    this.linePos = 0
    this.speed = 1
    this.imageChunks = []
    setTimeout(() => {
      this.animate()
    }, 0.5 * 1000)
  }

  download() {
    const a = document.createElement("a")
    a.download = "yourQueerImage.png"
    a.href = this.imageCanvas.toDataURL("image/png")
    a.click()
  }
}
