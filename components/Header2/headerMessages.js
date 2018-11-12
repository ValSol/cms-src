import { defineMessages } from 'react-intl';
/* Используются в:
1) HeaderTabs компоненте
2) SearchTextField компоненте
*/

export default defineMessages({
  Search: {
    id: 'Header.Search',
    defaultMessage: 'Поиск',
  },
  Editing: {
    id: 'Header.Editing',
    defaultMessage: 'Редактирование',
  },
  Deleting: {
    id: 'Header.Deleting',
    defaultMessage: 'Удаление',
  },
  Recovering: {
    id: 'Header.Recovering',
    defaultMessage: 'Восстановление',
  },
  Preview: {
    id: 'Header.Preview',
    defaultMessage: 'Предпросмотр',
  },
  Export: {
    id: 'Header.Export',
    defaultMessage: 'Экспорт',
  },
  Import: {
    id: 'Header.Import',
    defaultMessage: 'Импорт',
  },
  BackLinks: {
    id: 'Header.BackLinks',
    defaultMessage: 'Обратные ссылки',
  },
});
