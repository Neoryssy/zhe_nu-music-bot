"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioTransformer = void 0;
const child_process_1 = require("child_process");
const Log_1 = require("../utils/Log");
class AudioTransformer {
    constructor() { }
    getOpusStream(url) {
        const rawStream = this.getRawStream(url);
        const opusStream = this.convertToOpus(rawStream);
        return opusStream;
    }
    getRawStream(url) {
        const ytdl = (0, child_process_1.spawn)('youtube-dl', ['-f', '251', url, '-o', '-']);
        ytdl.stderr.on('data', (chunk) => {
            Log_1.Log.writeConsole(`Youtube-dl: ${chunk.toString()}`);
        });
        return ytdl.stdout;
    }
    convertToOpus(rawStream) {
        const ffmpeg = (0, child_process_1.spawn)('ffmpeg', ['-i', 'pipe:0', '-f', 'opus', 'pipe:1']);
        ffmpeg.stderr.on('data', (chunk) => {
            Log_1.Log.writeConsole(`FFmpeg: ${chunk.toString()}`);
        });
        rawStream.pipe(ffmpeg.stdin);
        return ffmpeg.stdout;
    }
}
exports.AudioTransformer = AudioTransformer;
