import { useAppStore } from './useAppStore';
import { ReadingResult } from '../api/types';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      screen: 'loading',
      previousScreen: null,
      ageVerified: false,
      imageConsentGiven: false,
      images: [],
      isProActive: false,
    });
  });

  it('starts on the loading screen with no consent granted', () => {
    const state = useAppStore.getState();
    expect(state.screen).toBe('loading');
    expect(state.ageVerified).toBe(false);
    expect(state.imageConsentGiven).toBe(false);
  });

  it('navigates between screens via goToScreen', () => {
    useAppStore.getState().goToScreen('onboarding');
    expect(useAppStore.getState().screen).toBe('onboarding');
  });

  it('goBack returns to wherever goToScreen was last called from', () => {
    useAppStore.getState().goToScreen('settings');
    useAppStore.getState().goToScreen('review');
    useAppStore.getState().goBack();
    expect(useAppStore.getState().screen).toBe('settings');
  });

  it('goBack falls back to the Analyze hub when there is nothing recorded to return to', () => {
    useAppStore.getState().goBack();
    expect(useAppStore.getState().screen).toBe('analyze');
  });

  it('tracks age verification and image consent independently', () => {
    useAppStore.getState().setAgeVerified(true);
    expect(useAppStore.getState().ageVerified).toBe(true);
    expect(useAppStore.getState().imageConsentGiven).toBe(false);
  });

  it('accumulates captured photos in order and can clear them', () => {
    useAppStore.getState().addImage('base64-calm');
    useAppStore.getState().addImage('base64-bright');
    useAppStore.getState().addImage('base64-deep');
    expect(useAppStore.getState().images).toEqual(['base64-calm', 'base64-bright', 'base64-deep']);

    useAppStore.getState().clearImages();
    expect(useAppStore.getState().images).toEqual([]);
  });

  it('tracks Pro entitlement status', () => {
    useAppStore.getState().setProActive(true);
    expect(useAppStore.getState().isProActive).toBe(true);
  });

  it('defaults to English and can switch language', () => {
    expect(useAppStore.getState().languageCode).toBe('en');
    useAppStore.getState().setLanguageCode('es');
    expect(useAppStore.getState().languageCode).toBe('es');
  });

  it('generates a stable anonymous device ID for the session', () => {
    const { anonymousId } = useAppStore.getState();
    expect(anonymousId).toMatch(/^faceai-anon-/);
    expect(useAppStore.getState().anonymousId).toBe(anonymousId);
  });

  it('defaults to the three-expression module and can switch it', () => {
    expect(useAppStore.getState().selectedModule).toBe('three-expression');
    useAppStore.getState().setSelectedModule('career-match');
    expect(useAppStore.getState().selectedModule).toBe('career-match');
  });

  it('holds the most recent reading result and can clear it', () => {
    expect(useAppStore.getState().reading).toBeNull();
    const narrative = {
      hero_hook: 'h',
      anatomical_decoding: ['a', 'b', 'c'],
      living_scenario: ['p1', 'p2', 'p3'],
      actionable_insight: { headline: 'h', description: 'd' },
    };
    const reading: ReadingResult = {
      module: 'career_path',
      career_oracle_card: {
        title: 'The Career Archetype & Oracle Match',
        work_archetype_tag: 'Strategic Innovator',
        career_oracle_match: 'A Public Figure',
        career_resonance: { percent: 90, archetype_label: 'Calm-Under-Fire Builders' },
        aura: { name: 'Slate Ember', intensity_percent: 80, explanation: 'e' },
        ...narrative,
      },
      industry_geometry_card: {
        title: 'Industry Geometry & Work-Style Radar',
        work_style_radar: [{ left_trait: 'Deep-Focus Craft', left_percent: 74, right_trait: 'Fast-Paced Hustle' }],
        top_industry_pills: ['Engineering & R&D'],
        ...narrative,
      },
      career_trait_symphony_card: {
        title: 'Trait Symphony & Working Polarities',
        polarity_meters: [{ left_trait: 'Structured Thinking', left_percent: 82, right_trait: 'Improvised Adaptation' }],
        rarity_index: { one_in_n: 310, trait_reason: 'r' },
        ...narrative,
      },
      career_shadow_arcana_card: {
        title: 'The Secret Signature & Shadow Arcana',
        work_catchphrase: '"Built the Spreadsheet, Ran the Room"',
        shadow_traits: ['Over-Preparing for Small Stakes'],
        role_recommendations: [],
        life_advice: 'a',
        mythic_tale: { tale_title: 't', paragraphs: ['p1', 'p2', 'p3'] },
        ...narrative,
      },
    };
    useAppStore.getState().setReading(reading);
    expect(useAppStore.getState().reading).toEqual(reading);
    useAppStore.getState().setReading(null);
    expect(useAppStore.getState().reading).toBeNull();
  });
});
