import updateDataInEntityMap from './updateDataInEntityMap';

import { locales } from '../../appConfig';

// специализированная функция в richText полях
// устанавливаем в IMAGE entities data значения width и height полученные ...
// ... из поля pictures (если такое поле имеется)
// fields = поля среди которых могут быть поле pictures и ...
// ... richText поля которые нуждаются в обработке

const updateDataFromPicturesInRichText = (fields, thingConfig) => {
  // если картинки не обновляются - выходим ничего не предпринимая
  // и возвращая те-же поля на выходе
  if (!fields.pictures) return fields;

  const { richTextFields } = thingConfig;

  // клонируем справочник с полями ...
  const fields2 = { ...fields };
  // а richText поля ГЛУБОКО клонируем (deep clone)
  // иначе entityMap в исходных полях и в результате оказываеются РАВНЫ
  // и при необходимости сравнивать initial состояние полей и vаlues (текущее)
  // initial уже не initial и изменяется вместе с onValueSave
  // полное (ГЛУБОКОЕ) клонирование richText полей решает эту проблему
  richTextFields.forEach(key => {
    fields2[key] = fields2[key] && JSON.parse(JSON.stringify(fields2[key]));
  });

  let fieldsChanged = false;
  // формируем объект содержащий данные которые нужно будет заменить
  const dataForUpdate = fields.pictures.map(
    ({ src, width, height, caption }) => ({
      src,
      width: width.toString(),
      height: height.toString(),
      caption,
    }),
  );
  const entitiesDataForUpdate = {
    IMAGE: {
      uniqueDataAttrName: 'src',
      dataForUpdate,
    },
  };

  richTextFields.forEach(richTextFieldName => {
    locales.forEach(lang => {
      const content =
        fields2[richTextFieldName] && fields2[richTextFieldName][lang];
      if (content) {
        const prevValue = fields2[richTextFieldName][lang];
        fields2[richTextFieldName][lang] = updateDataInEntityMap(
          content,
          entitiesDataForUpdate,
        );
        // если значение контента было изменено
        if (prevValue !== fields2[richTextFieldName][lang]) {
          fieldsChanged = true;
        }
      }
    });
  });
  if (!fieldsChanged) return fields;
  return fields2;
};

export default updateDataFromPicturesInRichText;
