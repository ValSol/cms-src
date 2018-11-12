/* eslint-disable no-underscore-dangle, import/prefer-default-export */
import Promise from 'bluebird';
import { SubmissionError } from 'redux-form';
import queryString from 'query-string';
import { plural } from 'pluralize';

import {
  composeExcerptFields,
  composeThingGqlQueriesByCompoundIndexes,
  composeThingGqlVariablesByCompoundIndexes,
  goToAbsolutePath,
} from '../../../core/utils';
import history from '../../../history';
import { getPathForRoute } from '../../routesUtils';
// получаем getLinksFromFields напрямую, а не из data/utils потому что ...
// ... в этом случае получается циклическая ссылка и приложение компилируется
import getLinksFromFields from '../../../data/utils/getLinksFromFields';
import composeAddThing from './composeAddThing.gql';
import composeThingById from '../composeThingById.gql';
import composeThings from '../composeThings.gql';
import composeThingPopulatedExcerpts from '../composeThingPopulatedExcerpts.gql';
import composeFragmentOnThingType from './composeFragmentOnThingType.gql';
import composeExcerpt from '../../../core/gql/composeExcerpt.gql';

// ----------------------------------------------------------------------
// утилита добавляет thing
// thingName - имя thing которая добавляется
// allVariables - переменные задающие thing
// client - apollo client для выполнение graphql выполнен
// _error - текст сообщения об ошибки
// returnData - флаг, указывающий надо ли возвращать данные

const add = (thingConfig, allVariables, client, _error, returnData) => {
  // получаем информацию по составным индексам необходимую для построения
  // соответствующих gql-запросов
  const { thingName } = thingConfig;

  const mutation = composeAddThing(thingConfig);
  const queryById = composeThingById(thingConfig);
  const queryThings = composeThings(thingConfig);
  const queryPopulatedExcerpts = composeThingPopulatedExcerpts(thingConfig);
  const queryExcerpt = composeExcerpt(thingConfig);
  // получаем содержимое кэша соответствующе запросу списка статей
  // порядок выборок получаем всегда чтобы не змаорачиваться с определением
  // _id новой выборки которая, возможно, была создана при создани thing
  const refetchQueries = [{ query: queryPopulatedExcerpts }];

  return client
    .mutate({
      mutation,
      variables: allVariables,
      refetchQueries,
      // !!! возможно добавить еще поле: optimisticResponse
      update(proxy, { data }) {
        // сохраняем полученные значения полей thing
        const thing = data[`add${thingName}`];
        const data2 = { [thingName.toLowerCase()]: thing };
        // создаем кеш запроса: thing по ID
        proxy.writeQuery({
          query: queryById,
          variables: { _id: thing._id },
          data: data2,
        });
        // создаем кеши запросовов исходя из compoundIndexes данного thing
        // например для  публикаций это 1 запрос по subject и section и slug
        const queries = composeThingGqlQueriesByCompoundIndexes(thingConfig);
        const variablesSets = composeThingGqlVariablesByCompoundIndexes(
          thingConfig,
          thing,
        );
        queries.forEach((query, i) =>
          variablesSets[i].forEach(variables =>
            proxy.writeQuery({
              query,
              variables,
              data: data2,
            }),
          ),
        );
        // обновляем кеш запросов: excerpt для всех orderedSets
        const variablesSetsForExcerpts = composeExcerptFields(
          thingConfig,
          thing,
        );
        variablesSetsForExcerpts.forEach(variables => {
          try {
            const queryData = proxy.readQuery({
              query: queryExcerpt,
              variables,
            });
            // в выборку добавляем _id созданной thing, при этом ...
            // ... ПЕРЕСОЗДАЕМ массив 'items' ...
            // ... иначе возникает ошибка: 'object is not extensible'
            const { items } = queryData.excerpt;
            queryData.excerpt.items = [...items, thing._id];
            proxy.writeQuery({
              query: queryExcerpt,
              data: queryData,
              variables,
            });
          } catch (err) {
            // если кеш для данного запроса не инициирован
            // ничего не предпринимем
          }
        });
        // обновляем кеш запроса: общий список things
        try {
          const queryData = proxy.readQuery({ query: queryThings });
          // например: data.articles.push(thing);
          queryData[`${plural(thingName.toLowerCase())}`].push(thing);
          proxy.writeQuery({
            query: queryThings,
            data: queryData,
          });
        } catch (err) {
          // если кеш для данного запроса не инициирован
          // ничего не предпринимем
        }
        // обновляем в кеше информацию об обратных ссылках
        const linksToAdd = getLinksFromFields(allVariables, thingConfig);

        linksToAdd.forEach(({ _id: _id2, thingName: thingName2 }) => {
          const fragment = composeFragmentOnThingType(thingName2);
          // получаем данные фрагмента для обновления списка обтратных ссылок
          try {
            const fragmentData = proxy.readFragment({
              id: `${thingName2}Type-${_id2}`,
              fragment,
            });
            fragmentData.backLinks.push({
              item: thing._id,
              itemThingName: thingName,
              __typename: `${thingName}Type`,
            });
            proxy.writeFragment({
              id: `${thingName2}Type-${_id2}`,
              fragment,
              data: fragmentData,
            });
          } catch (err) {
            // если кеш для данного фрагмента не инициирован
            // ничего не предпринимем
          }
        });
      },
    }) // eslint-disable-next-line consistent-return
    .then(({ data }) => {
      if (data && data[`add${thingName}`] && data[`add${thingName}`]._id) {
        if (!returnData) {
          // к примеру: вместо того чтобы вручную articleFormPath = "/admin/articles"
          // определяем articleFormPath, как ближайший путь
          // для которого используется роут: articleForm
          const { pathname } = history.location;
          const absoluteFormPath = getPathForRoute(
            pathname,
            `${thingName.toLowerCase()}ListRoute`,
          );
          const query = queryString.parse(history.location.search);
          // переходи по адресу созданной статьи
          // переходим к редактированию не оставляя адрес формы создания статьи ...
          goToAbsolutePath(
            `${absoluteFormPath}/${data[`add${thingName}`]._id}`,
            true,
            query,
          );
        } else {
          return Promise.resolve({ data });
        }
      } else {
        throw new SubmissionError({ _error });
      }
    })
    .catch(err => {
      if (err._error) throw err;
      // если случились какие-то ошибки
      throw new SubmissionError({ _error });
    });
};

export default add;
