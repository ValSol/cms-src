/* eslint-disable no-underscore-dangle */
import Promise from 'bluebird';
import { SubmissionError } from 'redux-form';
import deepEqual from 'deep-equal';

import {
  packFields,
  compareExcerptLists,
  composeExcerptFields,
  composeThingGqlQueriesByCompoundIndexes,
  composeThingGqlVariablesByCompoundIndexes,
} from '../../../core/utils';
// получаем getLinksForAddAndRemove напрямую, а не из data/utils потому что ...
// ... в этом случае получается циклическая ссылка и приложение компилируется
import getLinksForAddAndRemove from '../../../data/utils/getLinksForAddAndRemove';
import composeThingById from '../composeThingById.gql';
import composeThingPopulatedExcerpts from '../composeThingPopulatedExcerpts.gql';
import composeUpdateThing from '../composeUpdateThing.gql';
import composeFragmentOnThingType from './composeFragmentOnThingType.gql';
import composeExcerpt from '../../../core/gql/composeExcerpt.gql';

export default (fields, dispatch, props, thingConfig) => {
  // будем отправлять на сервер только те переменные которые поменялись
  const { client, initialFields, initialize } = props;
  const { compoundIndexFieldSets, paramFields, thingName } = thingConfig;

  const unpackedVariables = {};
  const initialFields2 = {};

  Object.keys(fields).forEach(key => {
    if (!deepEqual(fields[key], initialFields[key]) || key === '_id') {
      unpackedVariables[key] = fields[key];
      if (key !== '_id') initialFields2[key] = initialFields[key];
    }
  });

  const variables = {
    ...packFields(unpackedVariables, thingConfig),
    initial: packFields(initialFields2, thingConfig),
  };

  const queryById = composeThingById(thingConfig);
  const queryPopulatedExcerpts = composeThingPopulatedExcerpts(thingConfig);
  const mutation = composeUpdateThing(thingConfig);
  const queryExcerpt = composeExcerpt(thingConfig);
  const refetchQueries = [];
  // если путь поменялся обновляем кеш через повторный запрос
  // полного списка заполненных выборок
  // например, если variables.subject || variables.section
  // упрощаем массив чтобы использовать .include(name)
  const paramFieldsNames = paramFields.map(({ name }) => name);
  const paramsFromFieldSetsChanged = compoundIndexFieldSets.some(set =>
    // если поле - параметр состовного индекса и оно изменилось значит: true
    set.some(({ name }) => paramFieldsNames.includes(name) && variables[name]),
  );
  if (paramsFromFieldSetsChanged) {
    refetchQueries.push({ query: queryPopulatedExcerpts });
  }
  return client
    .mutate({
      mutation,
      variables,
      refetchQueries,
      update(proxy, { data }) {
        // для удобства переименовываем
        const thing = data[`update${thingName}`];
        const { _id } = thing;
        const data2 = { [thingName.toLowerCase()]: thing };
        // создаем кеш запроса: thing по ID
        proxy.writeQuery({
          query: queryById,
          variables: { _id },
          data: data2,
        });
        // обновляем кеш запросов: excerpt для всех orderedSets
        const variablesSetsForPrevExcerpts = composeExcerptFields(thingConfig, {
          // т.к. в initialFields при сохранении из RichTextEditor содержаться ...
          // ... только richText поля и pictures - для обновлении выборок ...
          // ... добавляем все остальные НЕизменные поля из thing, иначе ...
          // ... (если набор полей не полный) возникает ошибка в composeExcerptFields
          ...thing,
          ...initialFields,
        });

        const variablesSetsForExcerpts = composeExcerptFields(
          thingConfig,
          thing,
        );

        // получаем variablesSets нужные для обновления excerpts
        const { forAdd, forRemove } = compareExcerptLists(
          variablesSetsForPrevExcerpts,
          variablesSetsForExcerpts,
        );

        forAdd.forEach(variables2 => {
          // добавляем элемент в новую выборку
          try {
            const queryData = proxy.readQuery({
              query: queryExcerpt,
              variables: variables2,
            });
            // в выборку добавляем _id созданной thing, при этом ...
            // ... ПЕРЕСОЗДАЕМ массив 'items' ...
            // ... иначе возникает ошибка: 'object is not extensible'
            const { items } = queryData.excerpt;
            queryData.excerpt.items = [...items, _id];
            proxy.writeQuery({
              query: queryExcerpt,
              data: queryData,
              variables: variables2,
            });
          } catch (err) {
            // если кеш для данного запроса не инициирован
            // ничего не предпринимем
          }
        });

        forRemove.forEach(variables2 => {
          // удаляем элемент из старой выборки
          try {
            const queryData = proxy.readQuery({
              query: queryExcerpt,
              variables: variables2,
            });
            const { items } = queryData.excerpt;
            if (items.length < 2) {
              // если в выборке меньше 2 элементов ...
              // ... удаляем соответствующий запрос полностью
              proxy.writeQuery({
                query: queryExcerpt,
                variables: variables2,
                data: { excerpt: null },
              });
            } else {
              // в противном случае удаляем _id удаленного элемента
              queryData.excerpt.items = items.filter(item => item !== _id);
              proxy.writeQuery({
                query: queryExcerpt,
                data: queryData,
                variables: variables2,
              });
            }
          } catch (err) {
            // если кеш для данного запроса не инициирован
            // ничего не предпринимем
          }
        });

        // создаем кеши запросовов исходя из compoundIndexes данного thing
        // например для публикаций это 1 запрос по subject и section и slug
        const queries = composeThingGqlQueriesByCompoundIndexes(thingConfig);
        const variablesSets = composeThingGqlVariablesByCompoundIndexes(
          thingConfig,
          thing,
        );
        const variablesSets2 = composeThingGqlVariablesByCompoundIndexes(
          thingConfig,
          {
            // т.к. в initialFields при сохранении из RichTextEditor содержаться ...
            // ... только richText поля и pictures - для обновлении выборок ...
            // ... добавляем все остальные НЕизменные поля из thing, иначе ...
            // ... (если набор полей не полный) возникает ошибка в composeThingGqlVariablesByCompoundIndexes
            ...thing,
            ...initialFields,
          },
        );
        queries.forEach((query, i) => {
          variablesSets[i].forEach(variables2 =>
            proxy.writeQuery({
              query,
              variables: variables2,
              data: data2,
            }),
          );
          // обнуляем кеш по запросам по старым значениям ...
          // ... членов очередного составного индекса
          // например:  по subject, section и slug
          variablesSets2[i].forEach(variables2 =>
            proxy.writeQuery({
              query,
              variables: variables2,
              data: { [thingName.toLowerCase()]: null },
            }),
          );
        });

        // обновляем в кеше информацию об обратных ссылках
        const { linksToAdd, linksToRemove } = getLinksForAddAndRemove(
          packFields(initialFields, thingConfig),
          packFields(unpackedVariables, thingConfig),
          thingConfig,
        );

        linksToAdd.forEach(({ _id: _id2, thingName: thingName2 }) => {
          const fragment = composeFragmentOnThingType(thingName2);
          // получаем данные фрагмента для обновления списка обтратных ссылок
          try {
            const fragmentData = proxy.readFragment({
              id: `${thingName2}Type-${_id2}`,
              fragment,
            });
            fragmentData.backLinks.push({
              item: _id,
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
        data[`update${thingName}`] &&
        data[`update${thingName}`]._id === initialFields._id
      ) {
        // все в порядке сохранили тот объект что и собирались
        // реинициализируем поля формы чтобы кнопка СОХРАНИТЬ ИЗМЕНЕНИЯ ...
        // ... стала disabled
        if (initialize) initialize(fields); // используется с redux-form
        // используется при обновлении без применения redux-form
        return Promise.resolve(data[`update${thingName}`]);
      }
      throw new SubmissionError({ _error: 'FailureOfDataUpdating' });
    })
    .catch(err => {
      if (err._error) throw new SubmissionError(err);
      // если случились какие-то ошибки
      throw new SubmissionError({ _error: 'FailureOfDataUpdating' });
    });
};
