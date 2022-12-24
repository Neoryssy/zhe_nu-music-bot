import { google, youtube_v3 } from 'googleapis';
import { URL } from 'url';
import { Playlist, TrackOptions, Track, PlaylistOptions } from '../types/TrackQueue';
import { SourceInfo } from '../types/SourceInfo/SourceInfo';

const youtube = google.youtube({ version: 'v3', auth: process.env.GOOGLE_API_KEY });

export const nullFilter = (a: Array<any>): Array<any> => {
  return a.filter((e) => !!e);
};

export const validateYouTubeURL = (s: string): boolean => {
  try {
    const url = new URL(s);
    if (!url.host.match('youtube')) throw new Error();
    if (!url.searchParams.has('list') && !url.searchParams.has('v')) throw new Error();
    return true;
  } catch (e) {
    return false;
  }
};

export class Search {
  static fetchPlaylist = async (playlistId: string): Promise<Playlist | undefined> => {
    try {
      const playlistOptions: youtube_v3.Params$Resource$Playlists$List = {
        maxResults: 1,
        id: [playlistId],
        part: ['snippet'],
      };
      const playlistItemsOptions: youtube_v3.Params$Resource$Playlistitems$List = {
        maxResults: 50,
        part: ['contentDetails'],
        playlistId: playlistId,
      };

      const playlistResponse = await youtube.playlists.list(playlistOptions);
      const playlistItemsResponse = await youtube.playlistItems.list(playlistItemsOptions);

      if (playlistResponse.statusText !== 'OK' || !playlistResponse.data.items) return undefined;
      if (playlistItemsResponse.statusText !== 'OK' || !playlistItemsResponse.data.items) return undefined;

      const items = await Promise.all(
        playlistItemsResponse.data.items!.map(async ({ contentDetails }) => {
          return this.fetchVideo(contentDetails!.videoId!);
        })
      );
      const options: PlaylistOptions = {
        link: `https://www.youtube.com/playlist?list=${playlistResponse.data.items[0].id}`,
        title: playlistResponse.data.items[0].snippet!.title!,
        items: nullFilter(items),
        //@ts-ignore
        thumbnail: playlistResponse.data.items[0].snippet?.thumbnails?.default,
      };

      return new Playlist(options);
    } catch (e) {
      console.log(`Fetch playlist error: ${e}`)
      return undefined;
    }
  };

  static fetchVideo = async (videoId: string): Promise<Track | undefined> => {
    try {
      const videoInfo = await new SourceInfo(videoId, 'YouTube').getInfo();
      if (!videoInfo) return undefined;

      const { id, contentDetails, snippet } = videoInfo;
      const options: TrackOptions = {
        lengthSeconds: Number(contentDetails!.duration!),
        link: `https://www.youtube.com/watch?v=${id}`,
        title: snippet!.title!,
        //@ts-ignore
        thumbnail: snippet!.thumbnails!.default!,
      };

      return new Track(options);
    } catch (e) {
      console.log(`Fetch video error: ${e}`)
      return undefined;
    }
  };

  static search = async (q: string): Promise<Array<Track | Playlist>> => {
    if (validateYouTubeURL(q)) {
      return await this.searchByURL(q);
    } else {
      return await this.searchByQuery(q);
    }
  };

  static searchByQuery = async (q: string): Promise<Array<Track | Playlist>> => {
    const searchOptions: youtube_v3.Params$Resource$Search$List = {
      maxResults: 10,
      part: ['snippet'],
      q,
      safeSearch: 'none',
      type: ['video' /*, 'playlist'*/],
    };

    const res = await youtube.search.list(searchOptions);

    if (res.statusText !== 'OK' && !res.data.items?.length) return [];

    const items = await Promise.all(
      res.data.items!.map(async (e) => {
        if (e.id!.kind === 'youtube#playlist') return await this.fetchPlaylist(e.id!.playlistId!);
        else return await this.fetchVideo(e.id!.videoId!);
      })
    );

    return nullFilter(items);
  };

  static searchByURL = async (q: string): Promise<Array<Track | Playlist>> => {
    if (!validateYouTubeURL(q)) return [];

    const url = new URL(q);
    const listId = url.searchParams.get('list');
    const videoId = url.searchParams.get('v');

    let item: Track | Playlist | undefined = undefined;

    if (listId) item = await this.fetchPlaylist(listId);
    else if (videoId) item = await this.fetchVideo(videoId);

    return item ? [item] : [];
  };
}
