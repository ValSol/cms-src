import { defineMessages } from 'react-intl';
/* Используются в:
1) уотилите composeThingSideNavSection компонентsы SideNav
2) AllContentSideNavSection компоненте
3) ContentSideNavSection компоненте
*/

export default defineMessages({
  Content: {
    id: 'SideNav.Content',
    defaultMessage: 'Контент',
  },
  InGeneral: {
    id: 'SideNav.InGeneral',
    defaultMessage: 'В целом',
  },
  Separatly: {
    id: 'SideNav.Separatly',
    defaultMessage: 'По отдельности',
  },
  ExportImport: {
    id: 'SideNav.ExportImport',
    defaultMessage: 'Экспорт / Импорт',
  },
  DatabaseStatus: {
    id: 'SideNav.DatabaseStatus',
    defaultMessage: 'Состояние Базы данных',
  },
  GeneralList: {
    id: 'SideNav.GeneralList',
    defaultMessage: 'Общий список',
  },
});
