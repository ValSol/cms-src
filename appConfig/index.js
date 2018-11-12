/* eslint-disable max-len */
import * as _components from './components';
import _getAppConfigOfThing from './getThingConfig';
import _lightBaseTheme from './lightBaseTheme';
import _params from './params';
import _pathTree from './pathTree';
import _thingNames from './thingNames';
// -----------------------------------------------

// ВНИМАНИЕ appName используется в s3 бакете для хранения картинок
// если используем s3 хранилище - необходимо заранее создать бакет ...
// ... с именем: `images.${appName.toLowerCase()}`, к примеру: 'images.intellect.ua'
export const appName = 'Intellect.UA';

// запрещенные (зарезервированные для других целец)
// слова для thingNames: Param, Params, Thing, User
// ПЕРВЫЙ по порядку thingName - используется в качестве thingName "по умолчанию"
export const thingNames = _thingNames;

export const getThingConfig = _getAppConfigOfThing;

// default locale is the first one
// используется при работе с разными языками, а также ...
// ... для генерации i18nFields полей и работы с такими полями
export const locales = ['uk', 'ru', 'en'];

export const mongoLanguages = {
  uk: 'russian',
  ru: 'russian',
  en: 'english',
};

// все используемые параметры
export const params = _params;

// ------------------------------------------------------------------
// константы опеределяющие визуальный интерфейс
// высота ячейки в компоненте picturesSelect
export const picturesSelectCellHeight = 180;
// ------------------------------------------------------------------

export const pathTree = _pathTree;
// внешнний вид --------------------

export const lightBaseTheme = _lightBaseTheme;

export const paperPadding = 32;
export const buttonBottomShift = 16; // сдвиг плавающей копки от нижнего края экрана
export const sideNavWidth = 256;

// --------------------------
// компоненты
export const components = _components;
