// функция проверят соттветствует ли приведенный в текст упорядоченный список
// параметров paramNames, например "[\"sections"\,\"\subject"]"
// возможным груммпам параметров для заданного thingName

const isParamNamesCorrespondExcerptFieldSets = (thingConfig, paramNames) => {
  const { orderedSets } = thingConfig;
  return orderedSets.some(
    set => JSON.stringify(set.slice().sort()) === paramNames,
  );
};

export default isParamNamesCorrespondExcerptFieldSets;
