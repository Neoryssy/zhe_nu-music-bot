"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = exports.validateYouTubeURL = exports.nullFilter = void 0;
const googleapis_1 = require("googleapis");
const url_1 = require("url");
const TrackQueue_1 = require("../types/TrackQueue/TrackQueue");
const SourceInfo_1 = require("../types/SourceInfo/SourceInfo");
const moment_1 = __importDefault(require("moment"));
const youtube = googleapis_1.google.youtube({ version: 'v3', auth: process.env.GOOGLE_API_KEY });
const nullFilter = (a) => {
    return a.filter((e) => !!e);
};
exports.nullFilter = nullFilter;
const validateYouTubeURL = (s) => {
    try {
        const url = new url_1.URL(s);
        if (!url.host.match('youtube'))
            throw new Error();
        if (!url.searchParams.has('list') && !url.searchParams.has('v'))
            throw new Error();
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.validateYouTubeURL = validateYouTubeURL;
class Search {
}
exports.Search = Search;
_a = Search;
Search.fetchPlaylist = async (playlistId) => {
    try {
        const playlistOptions = {
            maxResults: 1,
            id: [playlistId],
            part: ['snippet'],
        };
        const playlistItemsOptions = {
            maxResults: 50,
            part: ['contentDetails'],
            playlistId: playlistId,
        };
        const playlistResponse = await youtube.playlists.list(playlistOptions);
        const playlistItemsResponse = await youtube.playlistItems.list(playlistItemsOptions);
        if (playlistResponse.statusText !== 'OK' || !playlistResponse.data.items)
            return undefined;
        if (playlistItemsResponse.statusText !== 'OK' || !playlistItemsResponse.data.items)
            return undefined;
        const items = await Promise.all(playlistItemsResponse.data.items.map(async ({ contentDetails }) => {
            return _a.fetchVideo(contentDetails.videoId);
        }));
        const options = {
            link: `https://www.youtube.com/playlist?list=${playlistResponse.data.items[0].id}`,
            title: playlistResponse.data.items[0].snippet.title,
            items: (0, exports.nullFilter)(items),
            thumbnail: playlistResponse.data.items[0].snippet?.thumbnails?.default,
        };
        return new TrackQueue_1.Playlist(options);
    }
    catch (e) {
        console.log(`Fetch playlist error: ${e}`);
        return undefined;
    }
};
Search.fetchVideo = async (videoId) => {
    try {
        const videoInfo = await new SourceInfo_1.SourceInfo(videoId, 'YouTube').getInfo();
        if (!videoInfo)
            return undefined;
        const { id, contentDetails, snippet } = videoInfo;
        const duration = moment_1.default.duration(contentDetails.duration);
        const options = {
            lengthSeconds: duration.asSeconds(),
            link: `https://www.youtube.com/watch?v=${id}`,
            title: snippet.title,
            thumbnail: snippet.thumbnails.default,
        };
        return new TrackQueue_1.Track(options);
    }
    catch (e) {
        console.log(`Fetch video error: ${e}`);
        return undefined;
    }
};
Search.search = async (q) => {
    if ((0, exports.validateYouTubeURL)(q)) {
        return await _a.searchByURL(q);
    }
    else {
        return await _a.searchByQuery(q);
    }
};
Search.searchByQuery = async (q) => {
    const searchOptions = {
        maxResults: 10,
        part: ['snippet'],
        q,
        safeSearch: 'none',
        type: ['video'],
    };
    const res = await youtube.search.list(searchOptions);
    if (res.statusText !== 'OK' && !res.data.items?.length)
        return [];
    const items = await Promise.all(res.data.items.map(async (e) => {
        if (e.id.kind === 'youtube#playlist')
            return await _a.fetchPlaylist(e.id.playlistId);
        else
            return await _a.fetchVideo(e.id.videoId);
    }));
    return (0, exports.nullFilter)(items);
};
Search.searchByURL = async (q) => {
    if (!(0, exports.validateYouTubeURL)(q))
        return [];
    const url = new url_1.URL(q);
    const listId = url.searchParams.get('list');
    const videoId = url.searchParams.get('v');
    let item = undefined;
    if (listId)
        item = await _a.fetchPlaylist(listId);
    else if (videoId)
        item = await _a.fetchVideo(videoId);
    return item ? [item] : [];
};
