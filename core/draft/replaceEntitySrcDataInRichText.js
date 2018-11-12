import replaceUniqueDataInEntityMap from './replaceUniqueDataInEntityMap';

import { locales } from '../../appConfig';

// специализированная функция в richText полях
// меняет в IMAGE entities data src на заданные значения
// fields = поля среди которых могут быть richText поля которые нуждаются в обработке
// fileNames - словарь вида: { имя_блоба: имя_файла }
// формируемый на клиенте для файлов которые аплоадятся на сервер
// data - словарь вида: { имя_файла: путь_используемый_вместо_блоба},
// получаемые с сервера после палоада файлов

const replaceEntitySrcDataInRichText = (
  fields,
  fileNames,
  data,
  thingConfig,
) => {
  const { richTextFields } = thingConfig;
  const fields2 = { ...fields };
  let fieldsChanged = false;
  // формируем объект содержащий данные которые нужно будет заменить
  const entitiesDataForChange = {
    IMAGE: {
      src: {},
    },
  };
  Object.keys(fileNames).forEach(blobName => {
    entitiesDataForChange.IMAGE.src[blobName] = data[fileNames[blobName]];
  });

  richTextFields.forEach(richTextFieldName => {
    locales.forEach(lang => {
      const content =
        fields2[richTextFieldName] && fields2[richTextFieldName][lang];
      if (content) {
        const prevValue = fields2[richTextFieldName][lang];
        fields2[richTextFieldName][lang] = replaceUniqueDataInEntityMap(
          content,
          entitiesDataForChange,
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

export default replaceEntitySrcDataInRichText;
