// функция сравнивает поэлементно два массива
const equalArrays = (arr1, arr2) => {
  // если массивы разной длины сразу понятно что не равны
  if (arr1.length !== arr2.length) return false;
  // сравниваем массивы поэлементно
  let result = true;
  arr1.forEach((item, i) => {
    if (item !== arr2[i]) result = false;
  });
  return result;
};

export default equalArrays;
