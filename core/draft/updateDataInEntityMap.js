// функция в исходном (raw) контенте draft-js обновляет entityMap,
// а именно: для entity указанного типа устанавливает значения (или ззаменяти их)
// лоя указанныъ атрибутов данных (принадлежащие объекту data)
// content - исходный (raw) контент
// entitiesDataForUpdate - объект задающий какие атрибуты нужно обновить ...
// ... и их новые значения
// например может выглядить так:
/*
entitiesDataForUpdate = {
  IMAGE: {
    uniqueDataAttrName: 'src',
    dataForUpdate: [
      {
        src: '/pictures/image1',
        widht: 100,
        height: 200,
      },
      {
        src: '/pictures/image2',
        widht: 200,
        height: 400,
      },
      {
        src: '/pictures/image3',
        widht: 300,
        height: 900,
      },
    ],
  },
  LINK: {
    uniqueDataAttrName: 'href',
    dataForUpdate: [
      {
        href: '/docs/pdf1',
        color: 'red',
      },
      {
        href: '/docs/pdf2',
        color: 'blue',
      },
      {
        href: '/docs/pdf3',
        color: 'white',
      },
    ],
  },
}; */

const updateDataInEntityMap = (content, entitiesDataForUpdate) => {
  const { entityMap } = content;
  let entityMapChanged = false;
  // заполняем
  Object.keys(entityMap).forEach(entityKey => {
    const entity = entityMap[entityKey];
    const { type } = entity; // например = 'IMAGE'
    if (entitiesDataForUpdate[type]) {
      const { uniqueDataAttrName } = entitiesDataForUpdate[type]; // пр = 'src'
      const uniqueValue = entity.data[uniqueDataAttrName];
      const data = entitiesDataForUpdate[type].dataForUpdate.find(
        item => item[uniqueDataAttrName] === uniqueValue,
      );
      if (data) {
        entityMapChanged = true;
        entityMap[entityKey].data = { ...entity.data, ...data };
      }
    }
  });
  if (!entityMapChanged) return content;
  return { ...content, entityMap };
};

export default updateDataInEntityMap;
