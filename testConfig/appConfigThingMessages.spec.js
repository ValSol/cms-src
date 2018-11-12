/* eslint-env jest */
import { plural } from 'pluralize';

import { getThingConfig, thingNames } from '../appConfig';

describe('appConfig Things', () => {
  thingNames.forEach(nameOfThing => {
    const { messages, thingName } = getThingConfig(nameOfThing);
    const thingName2 = plural(thingName);
    describe(`${thingName} appConfig`, () => {
      test('should have right number of messages', () => {
        expect(Object.keys(messages).length).toBe(19);
      });
      test('should have right Thing messages', () => {
        expect(messages[thingName].id).toBe(`${thingName}.${thingName}`);
        expect(messages[`New${thingName}`].id).toBe(
          `${thingName}.New${thingName}`,
        );
        expect(messages[`RecoveringThe${thingName}`].id).toBe(
          `${thingName}.RecoveringThe${thingName}`,
        );
        expect(messages[`ListOf${thingName2}`].id).toBe(
          `${thingName}.ListOf${thingName2}`,
        );
        expect(messages[`ExportOf${thingName2}`].id).toBe(
          `${thingName}.ExportOf${thingName2}`,
        );
        expect(messages[`ImportOf${thingName2}`].id).toBe(
          `${thingName}.ImportOf${thingName2}`,
        );
        expect(messages[`StatusOf${thingName2}`].id).toBe(
          `${thingName}.StatusOf${thingName2}`,
        );
        expect(messages[`EditingThe${thingName}`].id).toBe(
          `${thingName}.EditingThe${thingName}`,
        );
        expect(messages[`DeletingThe${thingName}`].id).toBe(
          `${thingName}.DeletingThe${thingName}`,
        );
        expect(messages[`The${thingName}Deleted`].id).toBe(
          `${thingName}.The${thingName}Deleted`,
        );
        expect(messages[`DeleteThe${thingName}`].id).toBe(
          `${thingName}.DeleteThe${thingName}`,
        );
        expect(messages[`RecoverThe${thingName}`].id).toBe(
          `${thingName}.RecoverThe${thingName}`,
        );
        expect(messages[`AddThe${thingName}`].id).toBe(
          `${thingName}.AddThe${thingName}`,
        );
        expect(messages[`GoToListOf${thingName2}`].id).toBe(
          `${thingName}.GoToListOf${thingName2}`,
        );
        expect(messages[`EditingThe${thingName}RichText`].id).toBe(
          `${thingName}.EditingThe${thingName}RichText`,
        );
        expect(messages[`Managing${thingName2}`].id).toBe(
          `${thingName}.Managing${thingName2}`,
        );
        expect(messages[`Prepared${thingName2}ForImport`].id).toBe(
          `${thingName}.Prepared${thingName2}ForImport`,
        );
        expect(messages[`${thingName2}InJsonFormat`].id).toBe(
          `${thingName}.${thingName2}InJsonFormat`,
        );
        expect(messages[`BackLinksOfThe${thingName}`].id).toBe(
          `${thingName}.BackLinksOfThe${thingName}`,
        );
      });
    });
  });
});
