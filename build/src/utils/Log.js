"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
require("colors");
const fs_1 = __importDefault(require("fs"));
class Log {
    static writeError(text) {
        const timestamp = new Date().toLocaleString();
        const message = `[${timestamp}] ${'[ERROR]'.red} ${text.red}\n`;
        fs_1.default.appendFileSync('Log.txt', message);
        console.log(message);
    }
    static writeErrorConsole(text) {
        const timestamp = new Date().toLocaleString();
        const message = `[${timestamp}] ${'[ERROR]'.red} ${text.red}`;
        console.log(message);
    }
    static write(text) {
        const timestamp = new Date().toLocaleString();
        const message = `[${timestamp}] ${text}\n`;
        fs_1.default.appendFileSync('Log.txt', message);
        console.log(message);
    }
    static writeConsole(text) {
        const timestamp = new Date().toLocaleString();
        const message = `[${timestamp}] ${text}`;
        console.log(message);
    }
}
exports.Log = Log;
