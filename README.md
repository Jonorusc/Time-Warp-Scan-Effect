# Time-Warp-Scan-Effect

This is an HTML document with a script that demonstrates a "time warp" effect on a live video stream from the user's camera. The effect is achieved by freezing parts of the video as it streams and then displaying these parts as a series of still images.

# how it works

The startVideo() function sets up the constraints for the camera stream and starts the stream. It also sets the dimensions of the canvas elements to match the dimensions of the video stream and starts the animation loop by calling the animate() function.

The animate() function is called repeatedly by the animation loop. It draws the current video frame onto the canvas and draws a horizontal line across the canvas at the current position. The function then generates a still image of the frozen part of the video and stores it in an array. The position of the line is then incremented, and the function is called again.

The reset() function resets the animation by resetting the position of the line and clearing the array of still images.

there are two HTML CANVAS, one to display the video and the other to render the image.
In fact, that's the big trick. Node code in the part:

```javascript
  animate() {
    // Draws the current video frame onto the video canvas
    this.videoCtx.drawImage(this.video, 0, 0)
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
```

this means that every time the line reaches this height it will generate an image of that piece (from the beginning to the line) and then store the piece of image in an array, and as the array receives data this other piece of code is responsible for assembling the pieces and forming a single image


Using this css block:

```css
.canvas-area {
  border: 1px solid #f2f2f2;
  width: 70vw;
  height: calc(100vh - 20px);
  margin: 10px 0;
  position: relative;
}
canvas {
  display: block;
  height: 100%;
  width: 100%;
}

#canvas,
#imageCanvas {
  position: absolute;
  top: 0;
  left: 0;
}
```

the two canvas are positioned in the same position, however. The second only appears when there are pieces of images to assemble, and when that happens it superimposes the video canvas, generating the effect

## Did you like it?
What do you think about creating a fork and modifying it your way?
