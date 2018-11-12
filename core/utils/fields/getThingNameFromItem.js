//  функция определят к какому типу Thing принадлежит item
// исходя из значения атрибута __typename
// например, если __typename === 'ArticleType' то возвращает: 'Article'

const getThingNameFromItem = ({ __typename }) =>
  __typename.slice(0, __typename.length - 'Type'.length);

export default getThingNameFromItem;
