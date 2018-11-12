import { convertFromRaw } from 'draft-js';

import decorator from './composeEmptyContentState';

// функция создает пустой контент для редактора draft-js
// причем можно указать key для первого (пустого блока)
// явное указание key позволяет избегать ошибки несоответствия
// контента построенного она серевере и на клиенте
// добавляем decorator чтобы отображать LINK, PHOTO и другие entities
const composeEmptyContentState = (key = 'foo') =>
  convertFromRaw({
    decorator,
    entityMap: {},
    blocks: [
      {
        entityRanges: [],
        key,
        text: '',
        type: 'unstyled',
      },
    ],
  });

export default composeEmptyContentState;
