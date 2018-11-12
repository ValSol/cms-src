import { locales } from '../../../appConfig';

// функция возвращает layout в зависимости от размера экрана

const oneInRow = {};
/* лайаут по одному гриду на строку, например:
{
  ukLayout: { x: 0, y: 0, w: 12, h: 1 },
  ruLayout: { x: 0, y: 1, w: 12, h: 1 },
  enLayout: { x: 0, y: 2, w: 12, h: 1 },
} */
locales.forEach((locale, i) => {
  oneInRow[`${locale}Layout`] = {
    x: 0,
    y: i,
    w: 12,
    h: 1,
  };
});

const twoInRow = {};
/* лайаут по 2 грида на строку, например:
{
  ukLayout: { x: 0, y: 0, w: 6, h: 1 },
  ruLayout: { x: 6, y: 0, w: 6, h: 1 },
  enLayout: { x: 0, y: 1, w: 6, h: 1 },
} */
locales.forEach((locale, i) => {
  twoInRow[`${locale}Layout`] = {
    x: 6 * Math.ceil(i % 2),
    y: Math.floor(i / 2),
    w: 6,
    h: 1,
  };
});

const threeInRow = {};
/* лайаут по 3 грида на строку, например:
{
  ukLayout: { x: 0, y: 0, w: 4, h: 1 },
  ruLayout: { x: 4, y: 0, w: 4, h: 1 },
  enLayout: { x: 8, y: 0, w: 4, h: 1 },
} */
locales.forEach((locale, i) => {
  threeInRow[`${locale}Layout`] = {
    x: 4 * Math.ceil(i % 3),
    y: Math.floor(i / 3),
    w: 4,
    h: 1,
  };
});

const getInitialLayout = mediaType => {
  switch (mediaType) {
    case 'extraSmall':
      return oneInRow;
    case 'small':
      return oneInRow;
    case 'medium':
      return oneInRow;
    case 'large':
      return twoInRow;
    case 'extraLarge':
      return twoInRow;
    default:
      return threeInRow;
  }
};

export default getInitialLayout;
