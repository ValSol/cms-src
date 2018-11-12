/* eslint-disable no-underscore-dangle, no-throw-literal */
import { SubmissionError } from 'redux-form';

import {
  goToAbsolutePath,
  packFields,
  removeUploadedFiles,
  thereAreFilesForUpload,
} from '../../../core/utils';
import { getPathForRoute } from '../../routesUtils';

import { add, updateWithFilesUpload } from '../utils';

const composeOnSubmitHandler = thingConfig => (
  fields,
  dispatch,
  thingFormProps,
) => {
  const { client, pathname } = thingFormProps;
  const { thingName } = thingConfig;

  // если нет файлов для загрузки на сервер - сохраняем прочую обновленную информацию
  if (!thereAreFilesForUpload(fields, thingConfig)) {
    const variables = packFields(fields, thingConfig);
    return add(thingConfig, variables, client, 'FailureOfDataAdding');
  }
  const fieldsWithoutFiles = removeUploadedFiles(fields, thingConfig);
  const variables = packFields(fieldsWithoutFiles, thingConfig);
  return add(thingConfig, variables, client, 'FailureOfDataAdding', true)
    .then(({ data: { [`add${thingName}`]: { _id } } }) => {
      const fieldsWithId = { ...fields, _id };
      const fieldsWithIdAndWithoutFiles = { ...fieldsWithoutFiles, _id };
      // в пропс заменяем initialFields чтобы обновить только поля содержавшие файлы
      const props2 = {
        ...thingFormProps,
        initialFields: fieldsWithIdAndWithoutFiles,
      };
      return updateWithFilesUpload(
        fieldsWithId,
        dispatch,
        props2,
        thingConfig,
      ).then(() => {
        // вместо того чтобы вручную articleFormPath = "/admin/articles"
        // определяем articleFormPath, как ближайший путь
        // для которого используется роут: articleForm
        const absoluteFormPath = getPathForRoute(
          pathname,
          `${thingName.toLowerCase()}ListRoute`,
        );
        goToAbsolutePath(`${absoluteFormPath}/${_id}`, true);
      });
    })
    .catch(err => {
      if (err._error) throw err;
      // если случились какие-то ошибки
      throw new SubmissionError({ _error: 'FailureOfDataAdding' });
    });
};

export default composeOnSubmitHandler;
