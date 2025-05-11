const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Lista de videos a procesar (pueden ser rutas locales o URLs si son accesibles localmente)
const videos = [
  //
  path.resolve(__dirname, 'videos', 'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Facing+Unilateral+Open+Chain+Hip+ROM.mp4'),
  path.resolve(__dirname, 'videos', 'https://cmsstorage.s3.us-east-2.amazonaws.com/videoserei/Wall+Sit+%2B+Pandiculation+Hold.mp4')
];


// Carpeta de salida para guardar las imágenes de preview
const outputDir = path.resolve(__dirname, 'previews');

// Asegúrate de que la carpeta de salida exista
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

/**
 * Función que extrae un frame aleatorio de un video y lo guarda como imagen.
 * @param {string} videoPath - La ruta completa al archivo de video.
 * @returns {Promise} - Se resuelve cuando la imagen se ha generado.
 */
function extractPreview(videoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        return reject(`Error obteniendo metadatos de ${videoPath}: ${err}`);
      }
      const duration = metadata.format.duration;
      if (!duration) {
        return reject(`No se pudo obtener la duración de ${videoPath}`);
      }
      // Escoge un tiempo aleatorio entre 1 y (duración - 1) segundos
      const randomSecond = Math.floor(Math.random() * (duration - 2)) + 1;
      
      ffmpeg(videoPath)
        .screenshots({
          timestamps: [randomSecond],
          filename: path.basename(videoPath, path.extname(videoPath)) + '_preview.png',
          folder: outputDir,
          size: '320x?'
        })
        .on('end', () => {
          console.log(`✅ Preview generada para ${path.basename(videoPath)}`);
          resolve();
        })
        .on('error', (e) => {
          reject(`Error generando preview para ${videoPath}: ${e}`);
        });
    });
  });
}

// Procesa todos los videos de la lista
(async () => {
  for (const videoPath of videos) {
    try {
      await extractPreview(videoPath);
    } catch (error) {
      console.error(error);
    }
  }
  console.log('Proceso finalizado.');
})();
