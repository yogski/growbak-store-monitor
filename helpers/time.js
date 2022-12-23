export default class TimeHelper {
  static delay(ms) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, ms);
    })
  }

  static unixTimestamp() {
    return Math.floor(Date.now() / 1000);
  }
}
