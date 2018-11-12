import { SubmissionError } from 'redux-form';
import axios from 'axios';

import {
  composeFormDataForUpload,
  removeUploadedFiles,
} from '../../../core/utils';
import {
  replaceEntitySrcDataInRichText,
  updateDataFromPicturesInRichText,
} from '../../../core/draft';
import {
  axiosRequest,
  axiosRequestFail,
  axiosRequestSuccess,
} from '../../../actions/axios';
import update from './update';

const updateWithFilesUpload = (fields, dispatch, props, thingConfig) => {
  const { thingName } = thingConfig;
  const [formData, fileNames] = composeFormDataForUpload(fields, thingConfig);
  const { _id: id } = fields;
  // проверяем что _id уже известно
  if (!id) throw new TypeError(`_id of ${thingName} must be set!`);
  // добавляем в передаваемые на сервер данные thingId
  // чтобы на сервере определить (создать)
  // папку с соответствующим именем для хранения файлов
  // eslint-disable-next-line no-underscore-dangle
  dispatch(axiosRequest({ id }));
  return axios
    .post('/api/uploads', formData)
    .then(({ data }) => {
      dispatch(axiosRequestSuccess({ id, data }));
      // готовим сохраненные переменные с обновленными значениями, а именно
      // 1) выбрасываем лишние данные (про локальные файл) из pictures
      // и с учетом адресов загруженных файлов заменяем данные в pictures
      const cleanedVariables = removeUploadedFiles(
        fields,
        thingConfig,
        fileNames,
        data,
      );
      // 2) с учетом адресов загруженных файлов заменяем данные в content
      const cleanedVariables2 = replaceEntitySrcDataInRichText(
        cleanedVariables,
        fileNames,
        data,
        thingConfig,
      );
      // 3) с учетом изменений в pictures вносим изменения в content
      const cleanedVariables3 = updateDataFromPicturesInRichText(
        cleanedVariables2,
        thingConfig,
      );
      // сохраняем на сервере результаты загрузки
      return update(cleanedVariables3, dispatch, props, thingConfig);
    })
    .catch(error => {
      dispatch(axiosRequestFail({ id, error }));
      throw new SubmissionError({ _error: 'FailureOfDataUpdating' });
    });
};

export default updateWithFilesUpload;
