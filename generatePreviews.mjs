// generatePreviews.mjs
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const videos = [
  'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Facing+Unilateral+Open+Chain+Hip+ROM.mp4',
  'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Sit+%2B+Pandiculation+Hold.mp4',
  'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Sit+Variation.mp4',
  'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wrist+Gyroscope+and+Finger+Glides.mp4'
]

const outputDir = path.resolve(__dirname, 'previews')
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

function extractPreview(videoUrl) {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(videoUrl).split('?')[0].replace(/\+/g, '_')
    const output = path.join(outputDir, `${fileName}_preview.png`)
    ffmpeg(videoUrl)
      .on('error', (err) => reject(`❌ Error: ${err.message}`))
      .on('end', () => {
        console.log(`✅ Preview generado: ${output}`)
        resolve()
      })
      .screenshots({
        count: 1,
        timemarks: ['5'],
        filename: `${fileName}_preview.png`,
        folder: outputDir,
        size: '320x?'
      })
  })
}

for (const video of videos) {
  extractPreview(video).catch(console.error)
}
