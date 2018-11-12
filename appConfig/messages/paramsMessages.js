import { defineMessages } from 'react-intl';

export default defineMessages({
  /* Используются в:
  1) ThingFormList компоненте
  */
  subjectFilterKey: {
    id: 'Params.subjectFilterKey',
    defaultMessage: 'По теме',
  },
  createdFilterKey: {
    id: 'Params.createdFilterKey',
    defaultMessage: 'Дате создания',
  },
  orderliness: {
    id: 'Params.orderliness',
    defaultMessage: 'Порядку',
  },
  editedFilterKey: {
    id: 'Params.editedFilterKey',
    defaultMessage: 'Дате редактирования',
  },
  /* Используются в:
  1) HeaderTabs компоненте
  2) утилите composeFields компоненты ThingForm
  3) утилите composeListItems компоненты ThingFormList
  4) утилите composeSelectFields компоненты ThingFormList
  5) Card компоненте из ThingFormOrderingList компоненты
  6) утилите composeListForContentSearch из thingSearch компонент
  7) утилите composeListForSearch из thingSearch компонент
  */
  // касательно subject:
  subject: {
    id: 'Params.subject',
    defaultMessage: 'Тема',
  },
  subjectFilterLabel: {
    id: 'Params.subjectFilterLabel',
    defaultMessage: 'Отобрано по теме',
  },
  subjectFilterAll: {
    id: 'Params.subjectFilterAll',
    defaultMessage: 'Все темы',
  },
  // касательно значений subject:
  trademark: {
    id: 'Params.trademark',
    defaultMessage: 'Торговые марки',
  },
  copyright: {
    id: 'Params.copyright',
    defaultMessage: 'Авторские права',
  },
  patent: {
    id: 'Params.patent',
    defaultMessage: 'Изобретения',
  },
  design: {
    id: 'Params.design',
    defaultMessage: 'Промышленные образцы',
  },
  // -------------------
  // касательно section:
  section: {
    id: 'Params.section',
    defaultMessage: 'Раздел',
  },
  sectionFilterLabel: {
    id: 'Params.sectionFilterLabel',
    defaultMessage: 'Отобрано по разделу',
  },
  sectionFilterAll: {
    id: 'Params.sectionFilterAll',
    defaultMessage: 'Все разделы',
  },
  // касательно значений section:
  info: {
    id: 'Params.info',
    defaultMessage: 'Информация',
  },
  services: {
    id: 'Params.services',
    defaultMessage: 'Услуги',
  },
  // ===========================================================================
  // далее перевод значений для фильтров в backLinks
  // кода передается синтетические thingConfig и paams
  // касательно __typename:
  __typename: {
    id: 'Params.__typename',
    defaultMessage: 'Сущность',
  },
  __typenameFilterLabel: {
    id: 'Params.__typenameFilterLabel',
    defaultMessage: 'Отобрано по сущности',
  },
  __typenameFilterAll: {
    id: 'Params.__typenameFilterAll',
    defaultMessage: 'Все сущности',
  },
  // касательно значений __typename:
  // они должны соответствовать всем значениям из thingNames
  ArticleType: {
    id: 'Params.ArticleType',
    defaultMessage: 'Публикация',
  },
  ServiceType: {
    id: 'Params.ServiceType',
    defaultMessage: 'Услуга',
  },
});
