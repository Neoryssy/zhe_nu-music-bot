"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoInfo = void 0;
const googleapis_1 = require("googleapis");
const Thumbnail_1 = require("../Thumbnail/Thumbnail");
const youtube = googleapis_1.google.youtube({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
class VideoInfo {
    constructor(id) {
        this.id = id;
        this.lengthSeconds = 0;
        this.thumbnails = [];
    }
    async fetchInfo() {
        const params = {
            id: [this.id],
            maxResults: 1,
            part: ['contentDetails']
        };
        const response = await youtube.videos.list();
        if (response.statusText !== 'OK')
            return null;
    }
    getInfo() {
        this.thumbnails = this.getThumbnails();
        return this;
    }
    getThumbnails() {
        const thumbNames = ['default', '1', '2', '3'];
        const thumbResolutions = ['lq', 'mq', 'hq', 'sd', 'maxres'];
        const thumbs = new Array();
        const url = `https://i3.ytimg.com/vi/${this.id}/`;
        thumbNames.forEach((thumbName) => {
            thumbResolutions.forEach((res) => {
                const dft = thumbName === 'default' ? true : false;
                const urlRes = res === 'lq' ? '' : res;
                const thumbURL = `${url}${urlRes}${thumbName}.jpg`;
                const thumb = new Thumbnail_1.Thumbnail(thumbURL, { default: dft, resolution: res });
                thumbs.push(thumb);
            });
        });
        return thumbs;
    }
}
exports.VideoInfo = VideoInfo;
