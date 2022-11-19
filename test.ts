const id = 'ZmJ5oBdJTXQ';
const thumbNames: Array<string> = ['default', '1', '2', '3'];
const thumbResolutions: Array<ThumbnailResolution> = ['lq', 'mq', 'hq', 'sd', 'maxres'];
const url: string = `https://i3.ytimg.com/vi/${id}/`;
const videoInfo: VideoInfo = new VideoInfo(id);

thumbNames.forEach((thumbName) => {
  thumbResolutions.forEach((res) => {
    const dft = thumbName === 'default' ? true : false;
    const urlRes = res === 'lq' ? '' : res;
    const thumbURL = `${url}${urlRes}${thumbName}.jpg`;
    const thumb = new Thumbnail(thumbURL, { default: dft, resolution: res });

    videoInfo.addThumbnail(thumb);
  });
});

console.log(videoInfo.thumbnails);
