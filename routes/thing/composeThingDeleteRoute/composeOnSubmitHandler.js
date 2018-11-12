/* eslint-disable no-underscore-dangle */
import { SubmissionError } from 'redux-form';
import { plural } from 'pluralize';

import {
  goToAbsolutePath,
  composeExcerptFields,
  composeThingGqlQueriesByCompoundIndexes,
  composeThingGqlVariablesByCompoundIndexes,
  getPopulatedExcerptsIndexesToDelete,
  packFields,
  saveState,
} from '../../../core/utils';

import { getPathForRoute } from '../../routesUtils';
// получаем getLinksFromFields напрямую, а не из data/utils потому что ...
// ... в этом случае получается циклическая ссылка и приложение компилируется
import getLinksFromFields from '../../../data/utils/getLinksFromFields';
import composeThingPopulatedExcerpts from '../composeThingPopulatedExcerpts.gql';
import composeDeleteThing from './composeDeleteThing.gql';
import composeThings from '../composeThings.gql';
import { composeFragmentOnThingType } from '../utils';
import composeExcerpt from '../../../core/gql/composeExcerpt.gql';

const composeOnSubmitHandler = thingConfig => (
  args,
  dispatch,
  thingFormProps,
) => {
  const { client, initialValues, pathname, query } = thingFormProps;
  const { thingName } = thingConfig;
  const mutation = composeDeleteThing(thingConfig);
  const queryPopulatedExcerpts = composeThingPopulatedExcerpts(thingConfig);
  const queryThings = composeThings(thingConfig);
  const queryExcerpt = composeExcerpt(thingConfig);

  // получаем содержимое кэша соответствующе запросу списка things
  const { _id } = args;
  return client
    .mutate({
      mutation,
      variables: packFields(initialValues, thingConfig),
      // !!! возможно добавить еще поле: optimisticResponse
      // eslint-disable-next-line no-shadow
      update(proxy, { data: { [`delete${thingName}`]: { _id } } }) {
        // обновляем кеш запроса: общий список things
        try {
          const data = proxy.readQuery({ query: queryThings });
          const index = data[plural(thingName.toLowerCase())].findIndex(
            element => element._id === _id,
          );
          if (index !== -1) {
            data[plural(thingName.toLowerCase())].splice(index, 1);
          }
          proxy.writeQuery({
            query: queryThings,
            data,
          });
        } catch (err) {
          // если кеш для данного запроса не инициирован
          // ничего не предпринимем
        }
        // обнуляем кеш по запросам по старым значениям ...
        // ... членов составных индексов, которые возвращали удаленный thing
        // например:  по subject, section и slug
        const queries = composeThingGqlQueriesByCompoundIndexes(thingConfig);
        const variablesSets = composeThingGqlVariablesByCompoundIndexes(
          thingConfig,
          initialValues,
        );
        queries.forEach((query2, i) =>
          variablesSets[i].forEach(variables =>
            proxy.writeQuery({
              query: query2,
              variables,
              data: { [thingName.toLowerCase()]: null },
            }),
          ),
        );

        // обновляем кеш запросов: excerpt для всех orderedSets
        const variablesSetsForExcerpts = composeExcerptFields(
          thingConfig,
          initialValues,
        );
        variablesSetsForExcerpts.forEach(variables => {
          try {
            const queryData = proxy.readQuery({
              query: queryExcerpt,
              variables,
            });
            const { items } = queryData.excerpt;
            if (items.length < 2) {
              // если в выборке меньше 2 элементов ...
              // ... удаляем соответствующий запрос полностью
              proxy.writeQuery({
                query: queryExcerpt,
                variables,
                data: { excerpt: null },
              });
            } else {
              // в противном случае удаляем _id удаленного элемента
              queryData.excerpt.items = items.filter(item => item !== _id);
              proxy.writeQuery({
                query: queryExcerpt,
                data: queryData,
                variables,
              });
            }
          } catch (err) {
            // если кеш для данного запроса не инициирован
            // ничего не предпринимем
          }
        });

        // обновляем кеш запроса: общий список заполненных выборок
        try {
          const data = proxy.readQuery({ query: queryPopulatedExcerpts });
          // получаем список индексов указывающий на предназначенные для ...
          // ... удаления элементы списка выборок
          const excerptIndexes = getPopulatedExcerptsIndexesToDelete(
            data.populatedExcerpts,
            _id,
          );
          // перебирать выборки будем с конца чтобы удаление выборки ...
          // ... НЕ сдвигало индексацию оставшихся выборок
          excerptIndexes.reverse();
          excerptIndexes.forEach(([excerptIndex, itemIndex]) => {
            const populatedExcerpt = data.populatedExcerpts[excerptIndex];
            if (populatedExcerpt.items.length < 2) {
              // если выборка содержит не более одного элемента - удаляем всю выборку
              data.populatedExcerpts.splice(excerptIndex, 1);
            } else {
              // если выборка содержит более одного элемента
              // удаляем УДАЛЕННЫЙ элемент
              populatedExcerpt.items.splice(itemIndex, 1);
            }
            proxy.writeQuery({
              query: queryPopulatedExcerpts,
              data,
            });
          });
        } catch (err) {
          // если кеш для данного запроса не инициирован
          // ничего не предпринимем
        }
        // обновляем в кеше информацию об обратных ссылках
        const linksToRemove = getLinksFromFields(
          packFields(initialValues, thingConfig),
          thingConfig,
        );

        linksToRemove.forEach(({ _id: _id2, thingName: thingName2 }) => {
          const fragment = composeFragmentOnThingType(thingName2);
          // получаем данные фрагмента для обновления списка обтратных ссылок
          try {
            const fragmentData = proxy.readFragment({
              id: `${thingName2}Type-${_id2}`,
              fragment,
            });
            const index = fragmentData.backLinks.findIndex(
              ({ item }) => item === _id,
            );
            fragmentData.backLinks.splice(index, 1);
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
    })
    .then(({ data }) => {
      if (
        data &&
        data[`delete${thingName}`] &&
        data[`delete${thingName}`]._id === _id
      ) {
        // сохраняем для возможности восстановление в дальнейшем
        saveState(`deleted${thingName}`, initialValues);
        // вместо того чтобы вручную? например absoluteFormPath = "/admin/articles/deleted"
        // определяем absoluteFormPath, как ближайший путь
        // для которого используется роут: articleRecoverRoute
        const absoluteFormPath = getPathForRoute(
          pathname,
          `${thingName.toLowerCase()}RecoverRoute`,
        );
        // переходим к адресу последней удалёной thing
        goToAbsolutePath(`${absoluteFormPath}`, true, query);
      } else {
        throw new SubmissionError({ _error: 'FailureOfDataDeleting' });
      }
    })
    .catch(err => {
      if (err._error) throw new SubmissionError(err);
      // если случились какие-то ошибки
      throw new SubmissionError({ _error: 'FailureOfDataDeleting' });
    });
};

export default composeOnSubmitHandler;
