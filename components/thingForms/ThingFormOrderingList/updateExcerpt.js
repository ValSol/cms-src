/* eslint-disable no-underscore-dangle */
import composeUpdateExcerpt from './composeUpdateExcerpt.gql';
import composeFragment from './composeFragmentOnPopulatedExcerptType.gql';

// функция обновляем порядок следования публикаций в разделе
export default async (props, context, state) => {
  const {
    thingConfig,
    thingConfig: { thingName },
    data: { excerpt: { _id } },
  } = props;
  const { client } = context;
  const { cards } = state;
  const items = cards.map(item => item.id);

  const fragment = composeFragment(thingConfig);
  const mutation = composeUpdateExcerpt(thingConfig);

  const result = await client.mutate({
    mutation,
    variables: {
      _id,
      items,
    },
    // eslint-disable-next-line no-shadow
    update(proxy, { data: { updateExcerpt: { _id, items } } }) {
      // обновляем кеш запроса: фрагмент соответствующий ЗАПОЛНЕННОЙ выборке
      // в которой в items было иземенен порядок
      try {
        const populatedExcerpt = proxy.readFragment({
          id: `PopulatedExcerptType-${_id}`,
          fragment,
        });
        // пересортировываем items в ЗАПОЛНЕННОЙ выборке
        populatedExcerpt.items = items.map(item => ({
          _id: item,
          __typename: `${thingName}Type`,
        }));
        // записываем изменения в кеш
        proxy.writeFragment({
          id: `PopulatedExcerptType-${_id}`,
          fragment,
          data: populatedExcerpt,
        });
      } catch (err) {
        // если кеш для данного запроса не инициирован
        // ничего не предпринимем
      }
    },
  });
  // если данные не найдены
  if (
    !result.data ||
    !result.data.updateExcerpt ||
    !result.data.updateExcerpt.items
  ) {
    return null;
  }

  return result.data.updateExcerpt.items;
};
