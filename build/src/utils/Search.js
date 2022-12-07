"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Search = exports.validateYouTubeURL = exports.nullFilter = void 0;
const googleapis_1 = require("googleapis");
const url_1 = require("url");
const TrackQueue_1 = require("../types/TrackQueue");
const VideoInfo_1 = require("../types/VideoInfo/VideoInfo");
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
            return null;
        if (playlistItemsResponse.statusText !== 'OK' || !playlistItemsResponse.data.items)
            return null;
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
        return null;
    }
};
Search.fetchVideo = async (videoId) => {
    try {
        const videoDetails = new VideoInfo_1.VideoInfo(videoId).getInfo();
        const options = {
            lengthSeconds: +videoDetails.lengthSeconds,
            link: `https://www.youtube.com/watch?v=${videoDetails.videoId}`,
            title: videoDetails.title,
            thumbnail: videoDetails.thumbnails[1],
        };
        return new TrackQueue_1.Track(options);
    }
    catch (e) {
        return null;
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
    let item = null;
    if (listId)
        item = await _a.fetchPlaylist(listId);
    else if (videoId)
        item = await _a.fetchVideo(videoId);
    return item ? [item] : [];
};
