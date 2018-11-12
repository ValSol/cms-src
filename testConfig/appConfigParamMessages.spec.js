/* eslint-env jest */
import { params, thingNames } from '../appConfig';
import { paramsMessages as messages } from '../appConfig/messages';

describe('appConfig Params Messages', () => {
  Object.keys(params).forEach(key => {
    test(`should have right messages for "${key}" param`, () => {
      expect(messages[key].id).toBe(`Params.${key}`);
      expect(messages[`${key}FilterLabel`].id).toBe(`Params.${key}FilterLabel`);
      expect(messages[`${key}FilterAll`].id).toBe(`Params.${key}FilterAll`);
    });
    params[key].forEach(name => {
      test(`should have right messages for "${name}" param value`, () => {
        expect(messages[name].id).toBe(`Params.${name}`);
      });
    });
    test(`should have right messages for "__typename" value`, () => {
      expect(messages.__typename.id).toBe('Params.__typename');
      // eslint-disable-next-line no-underscore-dangle
      expect(messages.__typenameFilterLabel.id).toBe(
        'Params.__typenameFilterLabel',
      );
      // eslint-disable-next-line no-underscore-dangle
      expect(messages.__typenameFilterAll.id).toBe(
        'Params.__typenameFilterAll',
      );
    });
    thingNames.forEach(name => {
      test(`should have right messages for "${name}Type" value`, () => {
        expect(messages[`${name}Type`].id).toBe(`Params.${name}Type`);
      });
    });
  });
});
