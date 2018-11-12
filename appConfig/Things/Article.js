import _messages from './messages/articleMessages';
import ArticlePreview from './components/ArticlePreview';
import { pictureFields } from '../specialFields';

// свойства задающие Article

// запрещенные (зарезирвированные для других целей)
// названия полей: messages,
// created, updated (служебные используются при сортировке itmes)

// специальные поля, свойства которых задаются их названиями
// и объявления который содержатся в data\specialMongooseFieldDeclarations\specialMongooseFieldDeclarations,
// и data\utils\specialFieldDeclarations, data\utils\specialArgsDeclarations

export const thingName = 'Article';

export const messages = _messages;

export const specialFields = [
  {
    // хранит уникальный идентификатор использующийся в адресной строке браузера
    name: 'slug',
    required: false,
    default: '', // для текстовых полей если required = false - указываеть по умолчанию
  },
  {
    // коллекция картинок
    name: 'pictures',
    required: false,
    default: [], // используем в thingAddRoute роуте и утилите getDeletedThing
    type: '[PictureInputType]',
    fields: pictureFields, // поля для конструировани полей gql-запроса / мутации
  },
];

// используется для генерации полей дата / время
export const booleanFields = [];

// используется для генерации текстовых полей, в том числе телефон, ...
// ... email, веб-адрес
export const textFields = [];

// используется для генерации полей дата / время
export const dateFields = [];

// используется для генерации числовых полей
export const numberFields = [];

// используется для генерации i18nFields полей и работы с такими полями
export const i18nFields = [
  {
    name: 'title',
    required: true,
  },
  {
    name: 'shortTitle',
    required: true,
  },
  {
    name: 'content',
    required: true,
  },
];

// используется для генерации полей-справочников и работы с такими полями
export const paramFields = [
  {
    name: 'subject',
    multiple: true,
    required: true,
  },
  {
    name: 'section',
    multiple: false,
    required: true,
  },
];

// используется для запаковки и распаковки RichText полей в форматe draft.js
// если имеются richTextFields то ...
// ... ОБЯЗАТЕЛЬНО используеся и специальное поле: 'pictures'
export const richTextFields = ['content'];

// поля содержат ВНЕДРЕННЫЕ документы ...
// ... построенных по определенной схеме. Схема задается свойствами ...
// ... внедренного документа, указанными в соответствующем файле,
// например, для внедренных документов Feautre в Feautre.js
export const subDocumentFields = [];

// используется для определения полей в которых могут быть ссылки на файлы
// требующие предварительной загрузки на сервер
// !!! uploadedFields - никаки не тестируется
export const uploadedFields = ['pictures'];

// группы полей-справочников (paramFields) ...
// ... задающие упорядочиваемые последовательности
// группа задавамая пустым массивом ([]) - подразумевает ...
// ... упорядочивание сразу ВСЕХ things данного типа
export const orderedSets = [['subject', 'section']];

// перечисляются группы полей входящие в
// составные УНИКАЛЬНЫЕ индексы
// каждый такой индекс содержит 1 или больше полей-справочников (paramFields)
// и РОВНО 1 поле - НЕ справочник
// такое поле НЕ справочник НЕ может быть i18n полем
// ДОЛЖНЫ имется в наличии i18n сообщения об ошибках ...
// ... `${notParamFieldName}AlreadyTaken` и (если разрешено пустое значение ) ...
// ... `${notParamFieldName}AsEmptyFieldAlreadyTaken`
export const compoundIndexFieldSets = [
  [
    {
      name: 'subject',
      order: 1,
    },
    {
      name: 'section',
      order: 1,
    },
    {
      name: 'slug',
      order: 1, // может быть 1 или -1
    },
  ],
];

// ----------------------------------------------------------
// настройки касающиеся стандартных форм
// ----------------------------------------------------------
// порядок отображения полей в форме ThingForm
// i18n поля - НЕ указываеются так как они всегда идут в конце
// в порядке указанном для массива i18nFields
export const orderOfTheFormFields = [
  ...paramFields.map(({ name, multiple, required }) => ({
    name,
    multiple,
    required,
    kind: 'paramFields',
  })),
  ...booleanFields.map(({ name, required }) => ({
    name,
    required,
    kind: 'booleanFields',
  })),
  ...dateFields.map(({ name, required }) => ({
    name,
    required,
    kind: 'dateFields',
  })),
  ...numberFields.map(({ name, required }) => ({
    name,
    required,
    kind: 'numberFields',
  })),
  ...textFields.map(({ name, required }) => ({
    name,
    required,
    kind: 'textFields',
  })),
  ...specialFields.map(({ name, required }) => ({
    name,
    required,
    kind: 'specialFields',
  })),
  ...subDocumentFields.map(({ name, array, required }) => ({
    name,
    array,
    required,
    kind: 'subDocumentFields',
  })),
];

// используемые варианты сортировки
export const sortingOptions = [
  // в sortTemplate используем имена полей, по которым проводится сортировка
  // двоеточие (:) перед именем поля означает что сортируем по значением параметра
  // и используя справочник params
  // внимание 'orderliness' НЕ использовать ЗАРЕЗЕРВИРОВАННОЕ для случая ...
  // ... упорядоченной вручную выборки (excerpt)
  {
    name: 'created',
    // created в sortTemplate - специальный зарезирвированный вычисляемый атрибут
    // Date.parse(item.createdAt)
    template: ['-created'],
  },
  {
    name: 'edited',
    // updated в sortTemplate - специальный зарезирвированный вычисляемый атрибут
    // Date.parse(item.updatedAt)
    template: ['-updated'],
    default: true,
  },
  {
    name: 'subject',
    template: [':subject', ':section'],
  },
];

// вычисляем один раз сортирвоку по умолчанию
export const defaultSortingOptionName = sortingOptions.reduce(
  (prev, { default: defaultOption, name }) => {
    // eslint-disable-next-line no-param-reassign
    if (defaultOption) prev = name;
    return prev;
  },
  '',
);

// вес подобран методом тыка (эмпирически) чтобы обесепечить
// наилучший порядок выдачи результатов
// eslint-disable-next-line import/prefer-default-export
export const textIndexFields = [
  {
    name: 'title',
    weight: 1024,
  },
  {
    name: 'content',
    weight: 512,
  },
];

// ----------------------------------------------------
// стандартные компонетны
export const ThingPreviewComponent = ArticlePreview;

// боковая навигация при активации административных роутов Article
export const sideNavSections = [
  'Article',
  'Service',
  'AllContentSideNavSection',
];

// боковая навигация при активации роутов Article при отображении контента
export const sideNavSectionsForContent = [
  'AllContentSideNavSection',
  'Article',
  'Service',
];

// имена полей, значения которых требуется иметь чтобы построить ...
// ... постоянную ссылку (perma link) на экземеплря thing,
// если массив пустой значит используется только значение _id
export const permaLinkFields = ['subject', 'section', 'slug'];
// фунция возвращающая путь соотвтествующий стандратному месту размещения контента
// внимание! т.к. subject множественное поле (multipe) ...
// ... используем первое значение
export const getThingPermanentPath = ({ subject, section, slug }) =>
  slug ? `/${subject[0]}/${section}/${slug}` : `/${subject[0]}/${section}`;
