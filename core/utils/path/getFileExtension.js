// функция возвращает расширение файла
// или, если реаширения нет - возвращает "" (пустую строку)
// fileName - имя файла из которого извлекается расширение
const getFileExtension = fileName => {
  const pieces = fileName.split('.');
  if (pieces.length === 1 || (pieces[1] === '' && pieces.length === 2)) {
    return '';
  }
  return pieces.pop().toLowerCase();
};

export default getFileExtension;
