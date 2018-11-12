// встпомогательная утилита которая формирует ...
// ... справочник укзаывающий на множественные поля
// например: { city: false, cuisine: true }
const getMultipleParams = thingConfig => {
  const { paramFields } = thingConfig;
  return paramFields.reduce((prev, { name, multiple }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = multiple;
    return prev;
  }, {});
};

export default getMultipleParams;
