
import ffmpegPkg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ffmpeg = ffmpegPkg.default ?? ffmpegPkg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const videosDir = path.resolve(__dirname, 'videos')
const outputDir = path.resolve(__dirname, 'previews')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

const videos = fs.readdirSync(videosDir)
  .filter(file => file.endsWith('.mp4'))
  .map(file => path.join(videosDir, file))

function extractPreview(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) return reject(`❌ Error metadatos: ${videoPath}`)

      const duration = metadata.format.duration
      const randomSecond = Math.floor(Math.random() * (duration - 2)) + 1

      ffmpeg(videoPath)
        .screenshots({
          timestamps: [randomSecond],
          filename: path.basename(videoPath, path.extname(videoPath)) + '_preview.png',
          folder: outputDir,
          size: '320x?'
        })
        .on('end', () => {
          console.log(`✅ Preview generada: ${path.basename(videoPath)}`)
          resolve()
        })
        .on('error', (e) => reject(`❌ Error ffmpeg: ${e}`))
    })
  })
}

;(async () => {
  for (const video of videos) {
    try {
      await extractPreview(video)
    } catch (err) {
      console.error(err)
    }
  }
  console.log('✅ ¡Proceso completo!')
})()



path.resolve(__dirname, 'videos', 'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Facing+Unilateral+Open+Chain+Hip+ROM.mp4'),
path.resolve(__dirname, 'videos', 'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Sit+%2B+Pandiculation+Hold.mp4'),
path.resolve(__dirname, 'videos', 'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Sit+Variation.mp4'),
path.resolve(__dirname, 'videos', 'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wrist+Gyroscope+and+Finger+Glides.mp4')
