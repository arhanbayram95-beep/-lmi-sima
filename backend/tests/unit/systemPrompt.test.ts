import { READING_MODULE_IDS } from '../../src/services/readingSchema';
import { READING_SYSTEM_PROMPTS } from '../../src/services/systemPrompt';

// The Questborn pivot exists because App Review rejected face-reading
// content as fortune telling (guideline 4.3(b)). These guard against a
// future prompt edit quietly dropping the rule that makes the output
// fiction rather than a reading of the real person.
describe('READING_SYSTEM_PROMPTS', () => {
  it.each(READING_MODULE_IDS)('%s forbids describing the real person', (moduleId) => {
    expect(READING_SYSTEM_PROMPTS[moduleId]).toContain('You are NOT reading, analyzing, or describing the real person.');
  });

  it.each(READING_MODULE_IDS)('%s forbids physiognomy and fortune-telling framing', (moduleId) => {
    expect(READING_SYSTEM_PROMPTS[moduleId]).toMatch(/Never use physiognomy, face reading, fortune telling, astrology, tarot/);
  });

  it.each(READING_MODULE_IDS)('%s forbids trademarked game references', (moduleId) => {
    expect(READING_SYSTEM_PROMPTS[moduleId]).toContain('never name or reference any trademarked game');
  });
});
