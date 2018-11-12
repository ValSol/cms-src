// функция в исходном (raw) контенте draft-js обновляет entityMap,
// а именно: для entity указанного типа заменяет указанные УНИКАЛЬНЫЕ
// атрибуты данных (принадлежащие объекту data)
// content - исходный (raw) контент
// entitiesDataForChange - объект задающий какие атрибуты нужно заменить
// например может выглядить так:
/*
entitiesDataForChange = {
  IMAGE: {
    src: {
      'blob:image1': '/pictures/image1',
      'blob:image2': '/pictures/image2',
      'blob:image3': '/pictures/image3',
    },
  },
  LINK: {
    href: {
      'blob:pdf1': '/docs/pdf1',
      'blob:pdf2': '/docs/pdf2',
      'blob:pdf3': '/docs/pdf3',
    },
  },
}; */

const replaceUniqueDataInEntityMap = (content, entitiesDataForChange) => {
  const { entityMap } = content;
  let entityMapChanged = false;
  // заполняем
  Object.keys(entityMap).forEach(entityKey => {
    const entity = entityMap[entityKey];
    const { type } = entity;
    if (entitiesDataForChange[type]) {
      Object.keys(entitiesDataForChange[type]).forEach(dataAttrName => {
        const dataAttrValue = entity.data[dataAttrName];
        if (entitiesDataForChange[type][dataAttrName][dataAttrValue]) {
          entityMapChanged = true;
          entityMap[entityKey].data[dataAttrName] =
            entitiesDataForChange[type][dataAttrName][dataAttrValue];
        }
      });
    }
  });
  if (!entityMapChanged) return content;
  return { ...content, entityMap };
};

export default replaceUniqueDataInEntityMap;
