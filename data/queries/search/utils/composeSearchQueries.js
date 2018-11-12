import { breakDownIntoWordsAndPhrases } from '../../../../core/utils';
// готовит набор строк поиска по следующему правилу
// 1) если пустая строка - возварщаем пустой массив: []
// 2) если одно слово, например: "китай" -
//  возвращаем массив с этим словом, например: ["китай"]
// 3) если несколько слов, одно или не сколько из которых взяты в кавычки
// "китайская жареная лапша" -
// возвращаем массив с одним элементом, полностью соответствующим исходному запросу
// например: ['китайские "острые приправы"']
// 4) если несколько слов, "китайская жареная лапша" -
// возвращаем массив с двумя элементами, например
// ["/"китайская жаренная лапша/"", "китайская жаренная лапша"]
// что обеспечивает 1-й поиск точно по фразе и 2-й поиск по словам из фразы

const composeSearchQueries = str => {
  if (str.indexOf('"') !== -1) {
    const wordsAndPhrases = breakDownIntoWordsAndPhrases(str);
    return [wordsAndPhrases.join(' ')];
  }
  const words = str.split(' ').filter(result => result);
  switch (words.length) {
    case 0:
      return [];
    case 1:
      return words;
    // eslint-disable-next-line no-case-declarations
    default:
      const str2 = words.join(' ');
      return [`"${str2}"`, str2];
  }
};

export default composeSearchQueries;
