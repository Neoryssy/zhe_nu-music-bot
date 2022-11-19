export type ThumbnailOptions = {
  default: boolean;
  resolution: ThumbnailResolution;
};
export type ThumbnailResolution = 'lq' | 'mq' | 'hq' | 'sd' | 'maxres';

export class Thumbnail {
  private _default: boolean;
  private _resolution: ThumbnailResolution;
  private _URL: string;

  constructor(url: string, options: ThumbnailOptions) {
    this._default = options.default;
    this._resolution = options.resolution;
    this._URL = url;
  }

  get default(): boolean {
    return this._default;
  }
  get resolution(): ThumbnailResolution {
    return this._resolution;
  }
  get url(): string {
    return this._URL;
  }
}