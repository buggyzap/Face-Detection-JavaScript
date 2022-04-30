const video = document.getElementById('video')

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://immedia-event.dgcal.it/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://immedia-event.dgcal.it/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://immedia-event.dgcal.it/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://immedia-event.dgcal.it/models')
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia(
    { video: {
        facingMode : "user"
      }
    }
  ).then( (mediaStream) => {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function(e) {
      video.play();
    };
  })
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
  }, 100)
})
