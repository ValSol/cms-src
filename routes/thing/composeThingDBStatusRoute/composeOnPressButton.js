import { plural } from 'pluralize';

import { setRuntimeVariable } from '../../../actions/runtime';
import composeThingsImport from '../../../core/gql/composeThingsImport.gql';

const composeOnPressButton = (thingConfig, context) => async () => {
  const { client, store } = context;
  const { runtime: { loading } } = store.getState();
  const { thingName } = thingConfig;

  if (loading) return;

  const mutation = composeThingsImport(thingConfig);
  // непосредственно перед выполнением мутации устанавливаем флаг 'loading'
  store.dispatch(setRuntimeVariable({ name: 'loading', value: true }));
  try {
    const { data } = await client.mutate({ mutation });
    // если НЕ получены корректные данные устанавливаем ошибку
    if (!data[`import${plural(thingName)}`]) {
      store.dispatch(
        setRuntimeVariable({
          name: 'error',
          value: 'DataProcessingFailure',
        }),
      );
    } else {
      // чистим кеш запросов и повторно выполяняем все АКТИВНЫЕ запросы
      // (запросы на результатах которых строятся какие-то текущие компоненты)
      await client.resetStore();
    }
  } catch (err) {
    // если при выполнении запросов случились какие-то ошибки ...
    // ... установливаем в store информацию об ошибке
    store.dispatch(
      setRuntimeVariable({
        name: 'error',
        value: 'DataProcessingFailure',
      }),
    );
  }
  // после отработки мутации синмаем флаг 'loading'
  store.dispatch(setRuntimeVariable({ name: 'loading', value: false }));
};

export default composeOnPressButton;
