// функция превращает строку в массив содержщаий отдельные слова
// и фразы которые были помещемны в кавычках
// напрмер: 'некоторые способы "искать в базе" данных'
// на выходе [некоторые', 'способы', '"искать в базе"', 'данных']

const breakDownIntoWordsAndPhrases = str => {
  const tokens = []
    .concat(...str.split('"').map((v, i) => (i % 2 ? `"${v}"` : v.split(' '))))
    .filter(Boolean);
  return tokens;
};

export default breakDownIntoWordsAndPhrases;
