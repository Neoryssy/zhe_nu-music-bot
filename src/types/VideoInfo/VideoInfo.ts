import { Thumbnail } from "../Thumbnail/Thumbnail";

export class VideoInfo {
  private _id: string;
  private _thumbnails: Array<Thumbnail>;

  constructor(id: string) {
    this._thumbnails = [];
    this._id = id;
  }

  get thumbnails(): Array<Thumbnail> {
    return this._thumbnails;
  }
  set thumbnails(t: Array<Thumbnail>) {
    this._thumbnails = t;
  }

  get id(): string {
    return this._id;
  }

  public addThumbnail(t: Thumbnail): void {
    this._thumbnails.push(t);
  }
}