import deepEqual from 'deep-equal';
// функция сравнивает поэлементно два массива параметров ...
// ... для задания excerpt'ов сооответствующих соответственно ...
// ... текущему состоянию thing и будущему состоянию thing
// и выдает объект с 2-мя массивами на выходе
// 1) forAdd - массив с параметрами excerpt'ов в которые будет добавляться _id
// 2) forRemove - массив с параметрами excerpt'ов из которых будет извлекаться _id

const compareExcerptLists = (arr1, arr2) => {
  const forRemove = arr1.reduce((prev, item1) => {
    if (!arr2.find(item2 => deepEqual(item1, item2))) {
      prev.push(item1);
    }
    return prev;
  }, []);
  const forAdd = arr2.reduce((prev, item2) => {
    if (!arr1.find(item1 => deepEqual(item1, item2))) {
      prev.push(item2);
    }
    return prev;
  }, []);
  return { forAdd, forRemove };
};

export default compareExcerptLists;
