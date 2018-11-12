// функция определяет есть ли ссылки на НЕ сохраненные файлы
// в (raw) контенте draft-js обновляет entityMap,
// content - сырое (raw) значение richText поля
// fileAttributes - справочник полей используемых в той или иной entity
// для хранения имени файла, например { IMAGE: 'src', LINK: 'href' }
// имеется похожая функция thereAreFilesForUpload - которая ищет файлы для загрузки
// в полях с данными предназначенными для загрузки

const thereAreBlobs = ({ entityMap }, fileAttributes) => {
  const result = Object.keys(entityMap).some(key => {
    const entity = entityMap[key];
    return (
      fileAttributes[entity.type] &&
      entity.data[fileAttributes[entity.type]].indexOf('blob:') === 0
    );
  });
  return result;
};

export default thereAreBlobs;
