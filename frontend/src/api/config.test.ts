import { assertSecureApiBaseUrl } from './config';

describe('assertSecureApiBaseUrl', () => {
  it('allows a plain http URL in a dev build', () => {
    expect(() => assertSecureApiBaseUrl('http://192.168.1.10:3000', true)).not.toThrow();
  });

  it('allows an https URL in a non-dev build', () => {
    expect(() => assertSecureApiBaseUrl('https://api.faceai.app', false)).not.toThrow();
  });

  it('rejects a plain http URL in a non-dev build', () => {
    expect(() => assertSecureApiBaseUrl('http://api.faceai.app', false)).toThrow(/https/);
  });
});
