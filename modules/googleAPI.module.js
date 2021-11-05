const { request } = require('./http.module');

class GoogleAPI {
  constructor() {
    this._API_KEY = process.env.GOOGLE_API_KEY;
    this._youtubeSearchURI = 'https://youtube.googleapis.com/youtube/v3/search';
  }

  async youtubeSearchVideo(query) {
    const res = await request(
      `${this._youtubeSearchURI}${encodeURI(
        `?part=snippet&q=${query}&type=video&type=playlist&key=${this._API_KEY}`
      )}`
    );

    console.log(res)

    return res;
  }
}

module.exports = GoogleAPI;
