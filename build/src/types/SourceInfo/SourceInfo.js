"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceInfo = void 0;
const googleapis_1 = require("googleapis");
const youtube = googleapis_1.google.youtube({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
class SourceInfo {
    constructor(id, source) {
        this._id = id;
        this._source = source;
    }
    async getInfo() {
        if ((this._source = 'YouTube'))
            return this.getYouTubeInfo();
        return undefined;
    }
    async getYouTubeInfo() {
        try {
            const params = {
                id: [this._id],
                maxResults: 1,
                part: [
                    'contentDetails',
                    'id',
                    'liveStreamingDetails',
                    'localizations',
                    'player',
                    'recordingDetails',
                    'snippet',
                    'statistics',
                    'status',
                    'topicDetails',
                ],
            };
            const response = await youtube.videos.list(params);
            if (response.statusText !== 'OK') {
                console.log(`Youtube API error: ${response.status} ${response.statusText}`);
                return;
            }
            if (!response.data.items || response.data.items?.length === 0)
                return;
            const videoInfo = response.data.items[0];
            return videoInfo;
        }
        catch (e) {
            console.log(`Get YouTube info error: ${e}`);
            return undefined;
        }
    }
}
exports.SourceInfo = SourceInfo;
