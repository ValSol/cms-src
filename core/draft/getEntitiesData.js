// функция возвращает перечень данных из entities опредленного типа, ...
// ... взятых из "исходного (сырого) контента" и удовлетворяющих функциям dataCheck
// entityMap - словарь entities из исходного (сырого) контента
// entityType - тип entities из которых отбираем данные
// dataCheck - словарь методов проверяющий правильность атрибутов

const getEntitiesData = ({ entityMap }, entityType, dataCheck) =>
  Object.keys(entityMap)
    .filter(key => entityMap[key].type === entityType)
    .map(key => entityMap[key].data)
    .filter(data =>
      Object.keys(dataCheck).every(key => dataCheck[key](data[key])),
    )
    .map(data =>
      Object.keys(dataCheck).reduce(
        (prev, key) => ({ ...prev, [key]: data[key] }),
        {},
      ),
    );

export default getEntitiesData;
