// Backend runs on port 3000 (see backend/.env.example / CLAUDE.md).
// localhost works from a simulator; a physical device needs the dev
// machine's LAN IP — set EXPO_PUBLIC_API_BASE_URL in that case.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';
