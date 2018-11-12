// утилита вычисляет количество столбцов в гриде с картинками
// исходя из размерова экрана

const colsCount = mediaType => {
  switch (mediaType) {
    case 'extraSmall':
      return 1;
    case 'small':
      return 2;
    case 'medium':
      return 4;
    case 'large':
      return 4;
    case 'infinity':
      return 5;
    default:
      throw new TypeError(`Uknown mediaType: "${mediaType}"`);
  }
};

export default colsCount;
