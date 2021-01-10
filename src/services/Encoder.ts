export class EncoderService {
  static encode(data: {}) {
    const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
    return encodeURIComponent(base64);
  }
}
