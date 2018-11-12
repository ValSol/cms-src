/* eslint-disable import/prefer-default-export */

import _composeSubDocumentType from './composeSubDocumentType';
import _composeThingType from './composeThingType';
import _ExcerptInputType from './ExcerptInputType';
import _ExcerptType from './ExcerptType';
import _I18nStringsInputType from './I18nStringsInputType';
import _I18nStringsType from './I18nStringsType';
import _LocalesEnumType from './LocalesEnumType';
// ВНИМАНИЕ часть типов не получается вызывать через index.js
// видимо по причине возиникновения циклических ссылок
// закомментированніе здесь типы вызываеются напрямую
// import _PictureInputType from './PictureInputType';
// import _PictureType from './PictureType';
// import _PopulatedExcerptType from './PopulatedExcerptType';
// import _SearchResultUnionType from './SearchResultUnionType';
// import _UserType2 from './UserType2';

export const composeSubDocumentType = _composeSubDocumentType;
export const composeThingType = _composeThingType;
export const ExcerptInputType = _ExcerptInputType;
export const ExcerptType = _ExcerptType;
export const I18nStringsInputType = _I18nStringsInputType;
export const I18nStringsType = _I18nStringsType;
export const LocalesEnumType = _LocalesEnumType;
// export const PictureInputType = _PictureInputType;
// export const PictureType = _PictureType;
// export const PopulatedExcerptType = _PopulatedExcerptType;
// export const SearchResultUnionType = _SearchResultUnionType;
// export const UserType2 = _UserType2;
