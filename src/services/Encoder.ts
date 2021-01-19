export class EncoderService {
  static encode(data: Record<string, any>) {
    const base64 = Buffer.from(JSON.stringify(data)).toString('base64');
    return encodeURIComponent(base64);
  }
}
