import { assertLooksLikeJpeg, InvalidImageError } from '../../src/services/imageValidation';

function jpegBase64(suffix = ''): string {
  return Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from(suffix)]).toString('base64');
}

describe('assertLooksLikeJpeg', () => {
  it('accepts a payload starting with the JPEG magic bytes', () => {
    expect(() => assertLooksLikeJpeg(jpegBase64('rest-of-the-file'))).not.toThrow();
  });

  it('rejects a payload with the wrong magic bytes (e.g. a PNG)', () => {
    const pngBase64 = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).toString('base64');
    expect(() => assertLooksLikeJpeg(pngBase64)).toThrow(InvalidImageError);
  });

  it('rejects plain text disguised as a photo', () => {
    const plainText = Buffer.from('definitely not an image').toString('base64');
    expect(() => assertLooksLikeJpeg(plainText)).toThrow(InvalidImageError);
  });

  it('rejects a string that is not valid base64 at all', () => {
    expect(() => assertLooksLikeJpeg('not-base64-!!!***')).toThrow(InvalidImageError);
  });

  it('rejects an empty string', () => {
    expect(() => assertLooksLikeJpeg('')).toThrow(InvalidImageError);
  });

  it('rejects a truncated payload shorter than the magic bytes themselves', () => {
    const tooShort = Buffer.from([0xff, 0xd8]).toString('base64');
    expect(() => assertLooksLikeJpeg(tooShort)).toThrow(InvalidImageError);
  });
});
