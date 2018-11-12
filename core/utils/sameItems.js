import equalArrays from './equalArrays';

// функция определяет имеются ли не совпадающие
// элементы в массивах
const sameItems = (arr1, arr2, coerceToString) => {
  const array1 = arr1
    .map(item => (coerceToString ? item.toString() : item))
    .sort();
  const array2 = arr2
    .map(item => (coerceToString ? item.toString() : item))
    .sort();
  return equalArrays(array1, array2);
};

export default sameItems;
