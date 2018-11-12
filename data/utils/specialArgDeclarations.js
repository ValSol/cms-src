import { GraphQLList, GraphQLString } from 'graphql/type';

import PictureInputType from '../types/PictureInputType';

// ---------------------------------------------------------------
// объявление всех специальных полей (с заранее назначенными названиями)
// предназначенных для использования в аргумента запросов и мутаций
// т.е. с использованием input - типов
// тип назначает ВСЕГДА без использования GraphQLNonNull

// массив картинок
export const pictures = {
  type: new GraphQLList(PictureInputType),
};
// уникальная (совместно с определенными параметрами) строка
// для задания thing в строке браузера
export const slug = {
  type: GraphQLString,
};
