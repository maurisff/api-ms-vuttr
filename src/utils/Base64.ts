export default class Base64 {
  public static encode (str: string): string {
    return Buffer.from(str, 'ascii').toString('base64')
  }

  public static decode (str: string): string {
    return Buffer.from(str, 'base64').toString('ascii')
  }
}
