import { ApiError } from '@google/genai';
import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';
import { everyModule, ReadingModelClient } from '../../src/services/geminiClient';
import { InvalidImageError } from '../../src/services/imageValidation';
import {
  buildPortraitPrompt,
  generatePortrait,
  PORTRAIT_FALLBACK_MODEL,
  PORTRAIT_MODEL,
  PortraitServiceError,
} from '../../src/services/portraitService';

function jpegBase64(label: string): string {
  return Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from(label)]).toString('base64');
}

const PHOTO = jpegBase64('calm');
const SUBJECT = {
  name: 'Wren Ashdown',
  epithet: 'the Unhurried Storm',
  lineage: 'Halfling',
  character_class: 'Bard',
  alignment: 'Chaotic Good',
  starting_gear: ['A lute with one cursed string', "Traveler's cloak"],
  companion_species: 'Clockwork sparrow',
};
const IMAGE_RESPONSE = {
  candidates: [{ content: { parts: [{ inlineData: { mimeType: 'image/png', data: 'cG5n' } }] } }],
};
const TEXT_ONLY_RESPONSE = { candidates: [{ content: { parts: [{ text: 'I cannot draw that.' }] } }] };

function clientWith(generateContent: jest.Mock): ReadingModelClient {
  return { models: { generateContent } };
}

describe('buildPortraitPrompt', () => {
  it('carries the likeness safety rules', () => {
    expect(buildPortraitPrompt(SUBJECT, false)).toContain('do not change their apparent age, skin tone, ethnicity, body shape');
  });

  it('asks for a stylized illustration, never a photo', () => {
    expect(buildPortraitPrompt(SUBJECT, false)).toContain('never a photorealistic image');
  });

  it('keeps a villain portrait campy rather than frightening', () => {
    expect(buildPortraitPrompt(SUBJECT, true)).toContain('campy, theatrical fantasy villain');
  });
});

describe('generatePortrait', () => {
  it('returns the image the model generated', async () => {
    const generateContent = jest.fn().mockResolvedValue(IMAGE_RESPONSE);

    await expect(generatePortrait([clientWith(generateContent)], PHOTO, SUBJECT)).resolves.toEqual({
      mime_type: 'image/png',
      data: 'cG5n',
    });
  });

  it('sends the photo before the prompt and asks for image output', async () => {
    const generateContent = jest.fn().mockResolvedValue(IMAGE_RESPONSE);

    await generatePortrait([clientWith(generateContent)], PHOTO, SUBJECT);

    const [[args]] = generateContent.mock.calls;
    expect([args.contents[0].parts[0].inlineData.data, args.config.responseModalities]).toEqual([PHOTO, ['IMAGE']]);
  });

  it('retries once on the fallback model after a transient failure', async () => {
    const generateContent = jest
      .fn()
      .mockRejectedValueOnce(new ApiError({ message: 'busy', status: 503 }))
      .mockResolvedValueOnce(IMAGE_RESPONSE);

    await generatePortrait([clientWith(generateContent)], PHOTO, SUBJECT);

    expect(generateContent.mock.calls.map(([args]) => args.model)).toEqual([PORTRAIT_MODEL, PORTRAIT_FALLBACK_MODEL]);
  });

  it('does not retry a bad request', async () => {
    const generateContent = jest.fn().mockRejectedValue(new ApiError({ message: 'bad', status: 400 }));

    await expect(generatePortrait([clientWith(generateContent)], PHOTO, SUBJECT)).rejects.toBeInstanceOf(PortraitServiceError);
    expect(generateContent).toHaveBeenCalledTimes(1);
  });

  it('fails cleanly when the model answers without an image (e.g. a safety block)', async () => {
    const generateContent = jest.fn().mockResolvedValue(TEXT_ONLY_RESPONSE);

    await expect(generatePortrait([clientWith(generateContent)], PHOTO, SUBJECT)).rejects.toBeInstanceOf(PortraitServiceError);
  });

  it('rejects a non-JPEG photo before calling the model', async () => {
    const generateContent = jest.fn();

    await expect(
      generatePortrait([clientWith(generateContent)], Buffer.from('not an image').toString('base64'), SUBJECT)
    ).rejects.toBeInstanceOf(InvalidImageError);
    expect(generateContent).not.toHaveBeenCalled();
  });
});

describe('POST /api/v1/reading/portrait', () => {
  let app: FastifyInstance;
  let generateContent: jest.Mock;

  beforeEach(async () => {
    generateContent = jest.fn();
    app = await buildApp(everyModule([clientWith(generateContent)]));
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns the portrait on success', async () => {
    generateContent.mockResolvedValue(IMAGE_RESPONSE);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/portrait',
      payload: { photo: PHOTO, character: SUBJECT },
    });

    expect([response.statusCode, response.json().data]).toEqual([200, 'cG5n']);
  });

  it('returns 400 for a payload missing the character', async () => {
    const response = await app.inject({ method: 'POST', url: '/api/v1/reading/portrait', payload: { photo: PHOTO } });

    expect(response.statusCode).toBe(400);
  });

  it('strips unknown character fields so they never reach the image prompt', async () => {
    generateContent.mockResolvedValue(IMAGE_RESPONSE);

    await app.inject({
      method: 'POST',
      url: '/api/v1/reading/portrait',
      payload: { photo: PHOTO, character: { ...SUBJECT, backstory: ['a very long story'] } },
    });

    const [[args]] = generateContent.mock.calls;
    expect(args.contents[0].parts[1].text).not.toContain('a very long story');
  });

  it('returns 502 when the image model returns no image', async () => {
    generateContent.mockResolvedValue(TEXT_ONLY_RESPONSE);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/reading/portrait',
      payload: { photo: PHOTO, character: SUBJECT },
    });

    expect(response.statusCode).toBe(502);
  });
});
