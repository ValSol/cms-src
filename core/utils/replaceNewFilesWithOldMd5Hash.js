// функция
// отфильтровывает элементы по уникальности md5Hash в новом массиве
// затем для каждого элемента из нового массива
// ... ищет в старом массиве элемент с тем же md5Hash...
// ... и, если находит:
// 1) заменяет новый элемент из нового массива на элемент из сатрого
// с тем же md5Hash
// 2) удаляет из старого массива элемент перенесенный в новый массив
// После перебора всех элементов нового массива возвращается ...
// ... переработанные новый (newArr) и старый (oldArr) массивы
// переменные:
// arr1 - изначальный новый массив,
// arr2 - изначальный старый массив,

const replaceNewFilesWithOldMd5Hash = (arr1, arr2) => {
  const oldArr = arr2.slice();
  const newArr = arr1
    // отфильтровываем повторенные файлы среди вновнь загруженных
    .filter((file, i, array) => {
      const prevFiles = array.slice(0, i);
      return !prevFiles.find(({ md5Hash }) => file.md5Hash === md5Hash);
    })
    .map(file => {
      let result = file;
      const { md5Hash } = file;
      const index = oldArr.findIndex(item => item.md5Hash === md5Hash);
      if (index !== -1) {
        result = oldArr[index]; // заменяем элемент в новом массиве и ...
        oldArr.splice(index, 1); // ... удаляем элемент из старого массива
      }
      return result;
    });
  return [newArr, oldArr];
};

export default replaceNewFilesWithOldMd5Hash;
