"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
class AudioTransformer {
}
const stream = (0, ytdl_core_1.default)('https://www.youtube.com/watch?v=tkqef33yRNA&list=OLAK5uy_kuWpWDq3ELEXrMDG04v-leohsjDCu1IhM&index=6&ab_channel=Oxxxymiron-Topic');
console.log(stream);
