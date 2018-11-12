// функция получает на входе 2 массива (arr1 и arr2) и возвращает массив ...
// ... содержащий все элементы из массива arr2, при этом элементы которые ...
// ... также присутствуют в массиве arr1 помещаются на первых позициях ...
// ... в том же порядке что и в массиве arr1, а оставшиеся элементы ...
// ... размещаются следом в том же порядке что в массиве arr2
/* например:
на входе:
arr1 = ['x1', 'a1', 'x2', 'a2', 'a3', 'x3', 'a4', 'a5', 'a6', 'x4', 'a7'];
arr1 = ['a5', 'a4', 'y1', 'a3', 'y2', 'a1', 'a7', 'a6', 'a2', 'y3', 'y4'];
на выходе:
['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'y1', 'y2', 'y3', 'y4'];
*/

const coerceArrayToArray = (arr1, arr2) => {
  const newItems = arr2.slice();
  const commonItems = arr1.reduce((prev, item) => {
    const index = newItems.indexOf(item);
    // если элемент из первого массива присутствует во втором массиве
    if (index !== -1) {
      // помещаем его в массив общих элементов (commonItems) и ...
      prev.push(item);
      // ... удаляем его из массива новых элементов (newItems)
      newItems.splice(index, 1);
    }
    return prev;
  }, []);
  return commonItems.concat(newItems);
};

export default coerceArrayToArray;
