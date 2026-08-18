// The route layer's JSON schema (routes/reading.ts) only guarantees each
// `photos` entry is *a string* within a length range — it says nothing
// about whether that string actually decodes to a photo. A client that
// skipped the app entirely (or a compromised/rewritten frontend) could
// otherwise submit arbitrary base64 garbage and have this service spend a
// paid Gemini call, and forward attacker-controlled bytes into the model's
// vision input, before anything ever checks what the "photo" actually is.
// This is the boundary check for that: reject before generateReading ever
// calls Gemini, not after.
export class InvalidImageError extends Error {}

// Every photo this app ever sends here is JPEG, on both capture paths:
// CaptureScreen's live camera output (usePhotoOutput's containerFormat:
// 'jpeg') and the "Choose from Library" picker (expo-image-picker's own
// docs on ImagePickerAsset.base64: "a Base64-encoded string of the
// selected image's JPEG data" — it transcodes to JPEG internally
// regardless of the source file's format, as long as quality isn't
// exactly 1.0 with allowsEditing off, which this app never sets). So a
// single, cheap check — the JPEG SOI + marker prefix (0xFF 0xD8 0xFF) —
// is both correct and sufficient; no need to sniff PNG/WebP/HEIC.
const JPEG_MAGIC_BYTES = [0xff, 0xd8, 0xff];

function looksLikeJpeg(bytes: Buffer): boolean {
  return JPEG_MAGIC_BYTES.every((byte, index) => bytes[index] === byte);
}

// Buffer.from(str, 'base64') never throws on malformed input — Node just
// decodes leniently and drops anything it can't parse — so garbage input
// (non-base64 text, a truncated string, a different file type entirely)
// surfaces here as bytes that simply don't match the JPEG prefix, not as
// a thrown decoding error. That's why there's no separate "is this valid
// base64" check: a failed decode and an invalid image collapse into the
// same rejection.
export function assertLooksLikeJpeg(base64Photo: string): void {
  const bytes = Buffer.from(base64Photo, 'base64');
  if (!looksLikeJpeg(bytes)) {
    throw new InvalidImageError('One of the submitted photos was not a valid JPEG image.');
  }
}
