import queryString from 'query-string';

// функция возвращает объект задающий редиерект...
// ... с фрагмента пути "from" на фрагмент пути "to"
// но сначал задаем вспомагательную функцию которая задает метод action
export const redirectAction = (from, to, context) => {
  const { baseUrl, path, query } = context;
  let start = baseUrl.replace(/\/+$/g, ''); // убираем слеш справа если есть
  start = from === '/' ? start : start.slice(0, -from.length); // удаляем from
  // получаем строку поиска (если она была)
  const search = Object.keys(query).length
    ? `?${queryString.stringify(query)}`
    : '';
  // закрывашющий слеш убираем если его не было изначально
  const end = path === '/' && baseUrl.slice(-1) !== '/' ? '' : path;
  // устанавливаем свойство "redirect" указывающее на необходимость редиректа
  // и опеределяющее абослютное значение пути
  const redirectPath =
    to === '/' ? start + end + search : start + to + end + search;
  return { redirect: redirectPath };
};
// -----------------------------------------------
const redirect = args =>
  args.map(([from, to]) => ({
    path: from,
    children: [
      {
        path: from === '' ? '' : '(.*)',
        action: context => redirectAction(from, to, context),
      },
    ],
  }));
export default redirect;
