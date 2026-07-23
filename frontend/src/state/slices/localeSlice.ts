import { StateCreator } from 'zustand';

export interface LanguageOption {
  code: string;
  englishName: string;
  nativeName: string;
}

// The 10 most-spoken languages worldwide by native speakers. This only
// controls the stored preference and the label shown in Settings — the
// app's UI copy itself is not yet translated (see AGENTS note in the
// LanguagePickerModal for scope).
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', englishName: 'English', nativeName: 'English' },
  { code: 'zh', englishName: 'Mandarin Chinese', nativeName: '中文' },
  { code: 'hi', englishName: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'es', englishName: 'Spanish', nativeName: 'Español' },
  { code: 'fr', englishName: 'French', nativeName: 'Français' },
  { code: 'ar', englishName: 'Arabic', nativeName: 'العربية' },
  { code: 'bn', englishName: 'Bengali', nativeName: 'বাংলা' },
  { code: 'pt', englishName: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', englishName: 'Russian', nativeName: 'Русский' },
  { code: 'ur', englishName: 'Urdu', nativeName: 'اردو' },
];

export interface LocaleSlice {
  languageCode: string;
  setLanguageCode: (code: string) => void;
}

export const createLocaleSlice: StateCreator<LocaleSlice> = (set) => ({
  languageCode: 'en',
  setLanguageCode: (code) => set({ languageCode: code }),
});
