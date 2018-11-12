import isArray from '../is/isArray';
// функция проверят соттветствует ли приведенный в текст упорядоченный список
// параметров paramNames, например "[\"sections"\,\"\subject"]"
// возможным груммпам параметров для заданного thingName
// имеется похожая функция thereAreBlobs - которая ищет не сохранные файлы
// в сонтетне draft-js формате

const thereAreFilesForUpload = (fields, thingConfig) => {
  const { uploadedFields } = thingConfig;
  return uploadedFields.some(
    uploadedFieldName =>
      fields[uploadedFieldName] &&
      (!isArray(fields[uploadedFieldName])
        ? fields[uploadedFieldName].file
        : fields[uploadedFieldName].some(({ file }) => file)),
  );
};

export default thereAreFilesForUpload;
