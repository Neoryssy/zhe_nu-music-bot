"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Thumbnail = void 0;
class Thumbnail {
    constructor(url, options) {
        this._default = options.default;
        this._resolution = options.resolution;
        this._URL = url;
    }
    get default() {
        return this._default;
    }
    get resolution() {
        return this._resolution;
    }
    get url() {
        return this._URL;
    }
}
exports.Thumbnail = Thumbnail;
