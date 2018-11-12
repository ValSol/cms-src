import { thereAreFilesForUpload } from '../../../core/utils';
import { update, updateWithFilesUpload } from '../utils';

const composeOnSubmitHandler = thingConfig => (fields, dispatch, props) => {
  // если нет файлов для загрузки на сервер - сохраняем прочую обновленную информацию
  if (!thereAreFilesForUpload(fields, thingConfig)) {
    return update(fields, dispatch, props, thingConfig);
  }

  return updateWithFilesUpload(fields, dispatch, props, thingConfig);
};

export default composeOnSubmitHandler;
