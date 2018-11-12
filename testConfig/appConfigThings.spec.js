/* eslint-env jest */
import { getThingConfig, thingNames } from '../appConfig';
import testAppConfigThingOrSubDocumentFields from './testAppConfigThingOrSubDocumentFields';

describe('appConfig Things', () => {
  thingNames.forEach(nameOfThing => {
    const thingConfig = getThingConfig(nameOfThing);
    const {
      compoundIndexFieldSets,
      getThingPermanentPath,
      i18nFields,
      orderedSets,
      paramFields,
      permaLinkFields,
      sideNavSections,
      sideNavSectionsForContent,
      textIndexFields,
      thingName,
      ThingPreviewComponent,
    } = thingConfig;
    describe(`${thingName} appConfig`, () => {
      describe(
        `Test fields of ${thingName}`,
        testAppConfigThingOrSubDocumentFields(thingConfig),
      );
      const i18nFieldNames = i18nFields.map(({ name }) => name);
      const paramFieldNames = paramFields.map(({ name }) => name);
      const paramFieldRequired = paramFields
        .filter(({ required }) => required)
        .map(({ name }) => name);
      test('should have right thingName', () => {
        expect(thingName).toBe(nameOfThing);
      });
      test('should have right orderedSets', () => {
        // убеждаемся что в каждой группе полей присутствуют ...
        // ... ТОЛЬКО поля-справочники
        // ... и значения в этих полях справочниках являются ОБЯЗАТЕЛЬНЫМИ
        orderedSets.forEach(set =>
          set.forEach(name => {
            expect(paramFieldNames.includes(name)).toBe(true);
            expect(paramFieldRequired.includes(name)).toBe(true);
          }),
        );
      });
      test('should have right compoundIndexFieldSets', () => {
        const notParamFields = compoundIndexFieldSets.map(set =>
          set.filter(({ name }) => !paramFieldNames.includes(name)),
        );
        // убеждаемся что в каждой группе полей более ОДНОГО поля
        compoundIndexFieldSets.forEach(set => {
          expect(set.length).toBeGreaterThan(1);
        });
        notParamFields.forEach(set => {
          // убеждаемся что в каждой группе РОВНО по ОДНОМУ полю - НЕ справочнику
          expect(set.length).toBe(1);
          // убеждаемся что это одно поле НЕ является i18n полем.
          expect(i18nFieldNames.includes(set[0].name)).toBe(false);
        });
        // !!! м.б. еще допроверить принадлежность полей не справочников ...
        // ... к правильным группам полей
      });
      test('should have right textIndexFields', () => {
        textIndexFields.forEach(({ name }) => {
          // убеждаемся что все текстово-индексовые поля являются i18n полями.
          expect(i18nFieldNames.includes(name)).toBe(true);
        });
      });
      test('should have right ThingPreviewComponent component', () => {
        // убеждаемся что задана стандратная компонента предпросмотра
        expect(ThingPreviewComponent).toBeDefined();
      });
      test('should have right permaLinkFields attribute', () => {
        // убеждаемся что имеется массив содержащий поля определяющие ...
        // ... постоянную ссылку
        expect(permaLinkFields.length).toBeDefined();
      });
      test('should have right getThingPermanentPath function', () => {
        // убеждаемся что задана функция определяющиая постоянную сстыкл
        expect(getThingPermanentPath).toBeDefined();
      });
      test('should have right sideNav settings', () => {
        // убеждаемся что заданы настройки для боковой навигации
        expect(sideNavSections.length).toBeGreaterThan(0);
        expect(sideNavSectionsForContent.length).toBeGreaterThan(0);
      });
    });
  });
});
