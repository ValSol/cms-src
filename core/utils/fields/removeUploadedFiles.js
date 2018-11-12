import flat, { unflatten } from 'flat';

// функция убирает информацию о загруженных файлах из соответствующих полей
// а также обновляет значение пути к загруженному файлу (src)
// fields - объект с обрабатываемыми полями
// fileNames - объект соответствий { blobAddress: newFileName }
// data - объект с получаемыми с сервера данными { newFileName: newSrc }

const removeUploadedFiles = (
  fields,
  thingConfig,
  fileNames = null,
  data = null,
) => {
  const fields2 = unflatten(flat(fields));
  const { uploadedFields } = thingConfig;
  // перебираем все поля которые могут содержать файлы для загрузки
  uploadedFields.forEach(fieldName => {
    if (fields2[fieldName] && fileNames) {
      // перебираем массив значений в поле
      fields2[fieldName].forEach(item => {
        if (item.file) {
          // если содержит файл - добавляем в formData
          delete item.file; // eslint-disable-line no-param-reassign
          window.URL.revokeObjectURL(item.src);
          item.src = data[fileNames[item.src]]; // eslint-disable-line no-param-reassign
        }
      });
    } else if (fields2[fieldName]) {
      fields2[fieldName] = [];
    }
  });
  return fields2;
};

export default removeUploadedFiles;
