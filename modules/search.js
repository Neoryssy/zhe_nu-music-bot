const ytdl = require('ytdl-core');
const { request } = require('./http.module');

module.exports.initSearch = async (opt) => {
  const API_KEY = process.env.GOOGLE_API_KEY;
  const youtubeSearchURI = 'https://youtube.googleapis.com/youtube/v3/search';

  let _type = '';
  let _searchResult = [];

  const getInfo = async () => {
    const info = await Promise.all(
      _searchResult.map(async (el, idx) => {
        const basicInfo = await ytdl.getBasicInfo(el.id.videoId);
        const { title, lengthSeconds, video_url } = basicInfo.videoDetails;

        return {
          title,
          lengthSeconds,
          URL: video_url,
          type: _type
        };
      })
    );

    return info;
  };

  const _searchYoutubeVideo = async (query, opt = {}) => {
    try {
      if (!opt?.types) opt.types = ['video', 'playlist'];
      if (!opt?.maxResults) opt.maxResults = 1;

      const typesString = opt.types.join('&type=');
      const res = await request(
        `${youtubeSearchURI}${encodeURI(
          `?part=snippet&maxResults=${opt.maxResults}&q=${query}&type=${typesString}&key=${API_KEY}`
        )}`
      );

      _type = 'ytVideo'
      _searchResult = res.items;
    } catch (e) {
      throw new Error(e);
    }
  };

  if (true) {
    await _searchYoutubeVideo(opt.query, opt?.types && opt.types);
  }

  return { _state: { _searchResult }, getInfo };
};
