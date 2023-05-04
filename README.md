# Time-Warp-Scan-Effect

This is an HTML document with a script that demonstrates a "time warp" effect on a live video stream from the user's camera. The effect is achieved by freezing parts of the video as it streams and then displaying these parts as a series of still images.

The HTML document includes a title, some CSS styles to set up the layout of the page, and a canvas element where the video and the still images will be displayed. There are also two buttons and a dropdown menu to allow the user to reset the animation, download the generated images, and select the camera device to use.

The JavaScript code sets up the necessary variables and functions to implement the time warp effect. It first checks if the browser supports the enumerateDevices() method of the navigator.mediaDevices object, which is used to list the available camera devices. If the method is supported, it enumerates the devices and populates the dropdown menu with the available camera devices.


# how it works

The startVideo() function sets up the constraints for the camera stream and starts the stream. It also sets the dimensions of the canvas elements to match the dimensions of the video stream and starts the animation loop by calling the animate() function.

The animate() function is called repeatedly by the animation loop. It draws the current video frame onto the canvas and draws a horizontal line across the canvas at the current position. The function then generates a still image of the frozen part of the video and stores it in an array. The position of the line is then incremented, and the function is called again.

The reset() function resets the animation by resetting the position of the line and clearing the array of still images.

there are two HTML CANVAS, one to display the video and the other to render the image.
In fact, that's the big trick. Node code in the part:

```javascript
const chunkHeight = canvas.height / 240 + lineWidth // Height of each image chunk
// Generate the image chunk every of the video height
if (linePos % chunkHeight <= speed) {
  const currentChunkIndex = Math.floor(linePos / chunkHeight)
  const imgData = ctx.getImageData(0, currentChunkIndex * chunkHeight + lineWidth, canvas.width, chunkHeight)
  imageChunks.push({ imgData, height: linePos - chunkHeight - lineWidth })
}

// Move the line down
linePos += speed

for (let i = 0; i < imageChunks.length; i++) {
  let chunk = imageChunks[i]
  imageCtx.putImageData(chunk.imgData, 0, chunk.height)
}
```

this means that every time the line reaches this height it will generate an image of that piece (from the beginning to the line) and then store the piece of image in an array, and as the array receives data this other piece of code is responsible for assembling the pieces and forming a single image


Using this css block:

```css
#canvas,
#imageCanvas {
  width: 70vw;
  height: 100vh;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
}
```

the two canvas are positioned in the same position, however. The second only appears when there are pieces of images to assemble, and when that happens it superimposes the video canvas, generating the effect

## Did you like it?
What do you think about creating a fork and modifying it your way?
