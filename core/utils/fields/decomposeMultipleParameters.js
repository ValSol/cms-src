// встпомогательная утилита которая получает набор things ...
// ... и, при наличии множественных полей-справочников (multiple = true) ...
// ... умножает количество things и преобразует их содержимое таким образом ...
// ... чтобы поля-справочники были представлены скалярными значениями

const decomposeMultipleParameters = (thingConfig, things) => {
  const { paramFields } = thingConfig;
  let result = [...things];
  paramFields.forEach(({ name, multiple }) => {
    if (multiple) {
      // разворачиваем things умножая каждый thing
      // на каждое использования param с именем name
      const tmpResult = result.reduce((prev, thing) => {
        // получаем значения очередного множественного справочника
        // например ['ukrain', 'russian', 'french']
        const paramList = [...thing[name]];
        // и для каждого значения добавляем в список things реплику
        // прочих значений и очередное значение paramValue
        // например { ...things, cuisine: 'ukraine' }
        paramList.forEach(paramValue =>
          prev.push({ ...thing, [name]: paramValue }),
        );
        return prev;
      }, []);
      result = tmpResult;
    }
  });
  return result;
};

export default decomposeMultipleParameters;
