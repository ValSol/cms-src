import { GraphQLList, GraphQLString } from 'graphql/type';

import PictureType from '../types/PictureType';

// ---------------------------------------------------------------
// обявление всех специальных полей (с заранее назначенными названиями)
// тип назначает ВСЕГДА без использования GraphQLNonNull

// массив картинок
export const pictures = {
  type: new GraphQLList(PictureType),
};
// уникальная (совместно с определенными параметрами) строка
// для задания thing в строке браузера
export const slug = {
  type: GraphQLString,
};
