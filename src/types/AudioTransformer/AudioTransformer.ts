import { spawn } from 'child_process';
import { Readable } from 'stream';
import { Log } from '../../utils/Log';

export class AudioTransformer {
  constructor() {}

  getOpusStream(url: string) {
    const rawStream = this.getRawStream(url);
    const opusStream = this.convertToOpus(rawStream);

    return opusStream;
  }

  getRawStream(url: string): Readable {
    const ytdl = spawn('yt-dlp', ['-f', '251', url, '-o', '-']);

    ytdl.stderr.on('data', (chunk: Buffer) => {
      Log.writeConsole(`Youtube-dl: ${chunk.toString()}`);
    });

    ytdl.stdout.on('error', () => {
      console.log('error');
      ytdl.kill();
    });

    return ytdl.stdout;
  }

  convertToOpus(rawStream: Readable) {
    const ffmpeg = spawn('ffmpeg', ['-i', 'pipe:0', '-f', 'opus', 'pipe:1']);

    ffmpeg.stderr.on('data', (chunk: Buffer) => {
      Log.writeConsole(`FFmpeg: ${chunk.toString()}`);
    });

    rawStream.pipe(ffmpeg.stdin);

    ffmpeg.stdin.on('error', () => {
      ffmpeg.kill();
    });

    return ffmpeg.stdout;
  }
}
