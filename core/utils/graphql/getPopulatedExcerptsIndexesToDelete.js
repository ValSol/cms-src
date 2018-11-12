// функция получает массив PopulatedExcerpts
// и возвращает массив массивов индексов указывающих на те члены массива
// в которых задействована указанная id
// populatedExcerpts - массив заполненных выборок
// id - _id thing выборки с которой должны быть отобраны
// на выходе массив масивов пар значений
// [[excerptIndex, itemIndex], [excerptIndex2, itemIndex2], ...]
// указывающих в какой по порядку выборке и в каком по порядке элементе ...
// ... внутри выборки находится элемент с искомым _id
const getPopulatedExcerptsIndexesToDelete = (populatedExcerpts, id) =>
  populatedExcerpts.reduce((prev, populatedExcerpt, excerptIndex) => {
    const itemIndex = populatedExcerpt.items.findIndex(({ _id }) => _id === id);
    if (itemIndex !== -1) prev.push([excerptIndex, itemIndex]);
    return prev;
  }, []);

export default getPopulatedExcerptsIndexesToDelete;
