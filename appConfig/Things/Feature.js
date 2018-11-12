// свойства задающие внедряемые документы Feature
import _messages from './messages/featureMessages';

// ВНИМАНИЕ!!! недопустимо использовать поле id (это поле генерируется автоматически)

// используется для созадания уникального имени типа graphql объекта
export const subDocumentName = 'Feature';

export const messages = _messages;

export const specialFields = [];

// используется для генерации полей дата / время
export const booleanFields = [];

// используется для генерации текстовых полей, в том числе телефон, ...
// ... email, веб-адрес
export const textFields = [];

// используется для генерации полей дата / время
export const dateFields = [];

// используется для генерации числовых полей
export const numberFields = [
  {
    name: 'fee',
    required: true,
  },
  {
    name: 'tax',
    required: true,
  },
];

// используется для генерации i18nFields полей и работы с такими полями
export const i18nFields = [
  {
    name: 'title',
    required: true,
  },
];

// используется для генерации полей-справочников и работы с такими полями
export const paramFields = [];

// ВНИМАНИЕ!!! в subDocument'ах richTextFields исзользовать НЕЛЬЗЯ
// всегда указывать ПУСТОЙ массив
export const richTextFields = [];

// поля представляющие из себя массивы внедренных документов ...
// ... построенных по определенной схеме. Схема задается свойствами ...
// ... внедренного документа, указанными в соответствующем файле,
// например, для внедренных документов Feautre в Feautre.js
export const subDocumentFields = [];

// ----------------------------------------------------------
// настройки касающиеся стандартных форм
// ----------------------------------------------------------
// порядок отображения полей в форме ThingForm
// i18n поля - НЕ указываеются так как они всегда идут в конце
// в порядке указанном для массива i18nFields
export const orderOfTheFormFields = [
  ...paramFields.map(({ name, required }) => ({
    name,
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
