const { request } = require('./http.module')

class GoogleAPI {
  constructor() {
    this.youtubeSearchURI = 'https://youtube.googleapis.com/youtube/v3/search'
  }

  async yotubeDataAPI({ youtubeAPIKey, query }) {
    const res = await request(
      `${this.youtubeSearchURI}${encodeURI(
        `?part=snippet&maxResults=1&q=${query}&key=${youtubeAPIKey}`//todo
      )}`
    )

    return res
  }
}

module.exports = new GoogleAPI()
