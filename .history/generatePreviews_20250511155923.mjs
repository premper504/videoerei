import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


// __dirname para ESModules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carpeta con los videos locales
const videosDir = path.resolve(__dirname, 'videos')

// Carpeta donde se guardarán las previews
const outputDir = path.resolve(__dirname, 'previews')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

// Leer todos los videos locales en la carpeta "videos"
const videos = fs.readdirSync(videosDir)
  .filter(file => file.endsWith('.mp4'))
  .map(file => path.join(videosDir, file))

// Función para generar la preview
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

// Ejecutar proceso
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
