import 'colors';
import fs from 'fs';

export class Log {
  static writeError(text: string) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] ${'[ERROR]'.red} ${text.red}\n`;

    fs.appendFileSync('Log.txt', message);
    console.log(message);
  }

  static writeErrorConsole(text: string) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] ${'[ERROR]'.red} ${text.red}`;

    console.log(message);
  }

  static write(text: string) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] ${text}\n`;

    fs.appendFileSync('Log.txt', message);
    console.log(message);
  }

  static writeConsole(text: string) {
    const timestamp = new Date().toLocaleString();
    const message = `[${timestamp}] ${text}`;

    console.log(message);
  }
}
