// функция отображает предупреждение (alarmDialog) о попытке покинуть ...
// ... радактируемую форму с НЕ сохраненными данными ...
// функция устанавливает данные в redux store чем инициализирует ...
// ... отображение предупреждения (alarmDialog) в компоненте Layout2
// context - это контекст компоненты ИЗ которой инициируется отображение ...
// ... предупреждения (alarmDialog)
/* для context'а должен объявляться store, например так:
static contextTypes = {
  store: PropTypes.object.isRequired,
};
*/
// href - адрес перехода внутри приложения в случае ...
// ... подтверждения ухода с текущей страницы
import { getAbsolutePath } from '../../core/utils';
import history from '../../history';
import { setRuntimeVariable } from '../../actions/runtime';

const showAlarmDialog = (context, href) => {
  // получаем из redux-store информацию о несохраненной редактируемой форме
  const { store } = context;
  const { runtime: { form } } = store.getState();
  const { pathname } = history.location;
  // если путь несохраненной формы соответсвует текущему пути
  // инициируем открытие диалога в компоненте Layout2
  if (form && form.dirty && form.absolutePath === getAbsolutePath(pathname)) {
    store.dispatch(
      setRuntimeVariable({
        name: 'alertDialogHref',
        value: href,
      }),
    );
    store.dispatch(
      setRuntimeVariable({
        name: 'alertDialogOpen',
        value: true,
      }),
    );
    return true;
  }
  return false;
};

export default showAlarmDialog;
