/* eslint-env jest */
import { locales } from '../appConfig';
import { langMessages } from '../appConfig/messages';

describe('appConfig locales Messages', () => {
  // проверям наличие всех сообщений
  locales.forEach(locale => {
    test(`should have right messages of locale "${locale}"`, () => {
      expect(langMessages[`${locale}IN${locale}`].id).toBe(
        `Lang.${locale}IN${locale}`,
      );
      expect(langMessages[`CaptionIN${locale}`].id).toBe(
        `Lang.CaptionIN${locale}`,
      );
      expect(langMessages[`IN${locale}`].id).toBe(`Lang.IN${locale}`);
      expect(langMessages[`IN${locale}Briefly`].id).toBe(
        `Lang.IN${locale}Briefly`,
      );
    });
  });
});
