import { google, youtube_v3 } from 'googleapis';

const youtube = google.youtube({ version: 'v3', auth: process.env.GOOGLE_API_KEY });

interface IYouTubeVideoInfo extends youtube_v3.Schema$Video {}

type Source = 'YouTube';

export class SourceInfo {
  private _id: string;
  private _source: Source;

  constructor(id: string, source: Source) {
    this._id = id;
    this._source = source;
  }

  async getInfo(): Promise<IYouTubeVideoInfo | undefined> {
    if ((this._source = 'YouTube')) return this.getYouTubeInfo();
    return undefined;
  }

  async getYouTubeInfo(): Promise<IYouTubeVideoInfo | undefined> {
    try {
      const params: youtube_v3.Params$Resource$Videos$List = {
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
      if (!response.data.items || response.data.items?.length === 0) return;

      const videoInfo: IYouTubeVideoInfo = response.data.items[0];

      return videoInfo;
    } catch (e) {
      console.log(`Get YouTube info error: ${e}`);
      return undefined;
    }
  }
}
