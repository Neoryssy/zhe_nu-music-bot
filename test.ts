const { spawn } = require('child_process');

class VideoInfo {
  constructor(thumbnailInfo: Array<string>) {

  }
}

const ytdlp = spawn('console_apps/yt-dlp', [
  'https://www.youtube.com/watch?v=ZmJ5oBdJTXQ',
  '--list-thumbnails',
]);

ytdlp.stdout.setEncoding('utf8');
ytdlp.stdout.on('data', (chunk: string) => {
  if (!chunk.match(/\d+\s.*\s.*\shttps?:\/\/.+\.(?=jpg|webp).*/g)) return;

  const array = chunk.split('\n');
  const startIndex = array.findIndex((v) => v.startsWith('0'));

  console.log(array[3].split(/\s+/));
});
