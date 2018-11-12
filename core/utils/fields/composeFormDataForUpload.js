import getFileExtension from '../path/getFileExtension';
import thereAreFilesForUpload from './thereAreFilesForUpload';
// функция выбирает из полей данные о файлах предназначенных для загрузки
// и формирует из них данный для передачи в формате FormData
// а также возвращает словарь содержащий ссылки на новые имена загружаемых файлов
// ВНИМАНИЕ предполагается что поля типа uploadedFields являются массивами!
// fields - объект с обрабатываемыми полями

const composeFormDataForUpload = (fields, thingConfig) => {
  const { thingName, uploadedFields } = thingConfig;
  // если в полях нет файлов предназначенных для загрузки возвращаем null
  if (!thereAreFilesForUpload(fields, thingConfig)) return null;
  const formData = new FormData();
  // будем передавать thingId чтобы на сервере определить (создать)
  // папку с соответствующим именем для хранения файлов
  // eslint-disable-next-line no-underscore-dangle
  formData.append('thingId', fields._id);
  // thingName - используется, на сервере чтобы складывать загружаемые файлы
  // в соответствующую thingName папку
  formData.append('thingName', thingName);

  const fileNames = {};
  uploadedFields // перебираем все поля которые могут содержать файлы для загрузки
    .forEach(fieldName => {
      if (fields[fieldName]) {
        fields[fieldName] // перебираем массив значений в поле
          .forEach(({ file, src, md5Hash }) => {
            if (file) {
              // если содержит файл - добавляем в formData
              const fileName = `${md5Hash}.${getFileExtension(file.name)}`;
              formData.append('filesForUpload', file, fileName);
              fileNames[src] = fileName;
            }
          });
      }
    });
  return [formData, fileNames];
};

export default composeFormDataForUpload;
