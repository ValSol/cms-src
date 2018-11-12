import { GraphQLList, GraphQLNonNull, GraphQLString } from 'graphql/type';

import { mongoLanguages } from '../../../appConfig';
import { LocalesEnumType } from '../../types';
import SearchResultUnionType from '../../types/SearchResultUnionType';

import { getTextIndex } from '../../mongooseModels';
import composeSearchQueries from './utils/composeSearchQueries';

/* для выполнения запроса НЕОБХОДИМО использовать фрагменты!
   так как в типе возвращаемого значения используется union-тип.
   Пример:
  {
    search(query: "abc", thingName: "Article", locale: uk) {
      ... on ArticleType {
        _id
        title {
          uk
        }
        content {
          uk
        }
      }
    }
  }
  предполагается в дальнейшем РАСШИРИТЬ ЭТУ мутацию для
  работы НЕ только для Article
*/

const search = {
  type: new GraphQLList(SearchResultUnionType),
  description: 'Search results selected by query & locale',
  args: {
    thingName: {
      name: 'thingNameOfItemsForSearch',
      type: new GraphQLNonNull(GraphQLString),
    },
    locale: {
      name: 'localeForSearch',
      type: new GraphQLNonNull(LocalesEnumType),
    },
    query: {
      name: 'searchQuery',
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  async resolve(root, { query, thingName, locale }) {
    // получаем список запросов по которым будет осуществлен поиск
    const queriesList = composeSearchQueries(query);
    const language = mongoLanguages[locale];
    const TextIndex = await getTextIndex(thingName, locale);
    let items;
    if (!queriesList.length) {
      // если поиска нет выходим
      return null;
    } else if (queriesList.length === 1) {
      // ищем по одному слову
      const [firstQuery] = queriesList;
      items = await TextIndex.find(
        { $text: { $search: firstQuery, $language: language } },
        { score: { $meta: 'textScore' } },
      )
        .populate('_item')
        .sort({ score: { $meta: 'textScore' } })
        .exec();
    } else {
      // ищем по точной фразе
      const [firstQuery, secondQuery] = queriesList;
      items = await TextIndex.find(
        { $text: { $search: firstQuery, $language: language } },
        { score: { $meta: 'textScore' } },
      )
        .populate('_item')
        .sort({ score: { $meta: 'textScore' } })
        .exec();
      if (!items.length) {
        // если при поиске по точной фразе ничего не находим ...
        // ... ищем по отдельным словам
        items = await TextIndex.find(
          { $text: { $search: secondQuery, $language: language } },
          { score: { $meta: 'textScore' } },
        )
          .populate('_item')
          .sort({ score: { $meta: 'textScore' } })
          .exec();
      }
    }

    const result = items.map(item => {
      const { score, _item } = item.toObject();
      return { ..._item, score, thingName };
    });

    return result;
  },
};

export default search;
