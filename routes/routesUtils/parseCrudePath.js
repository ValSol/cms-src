// вспомогательная функция используется в unfoldPathTree
// Разделяет и выдает 1) собственно путь; 2) указанные в скобках имена роутов.
const parseCrudePath = crudePath => {
  const path = crudePath.trim().split('(')[0];
  const routeNames = /\(([^)]+)\)/.exec(crudePath)
    ? /\(([^)]+)\)/
        .exec(crudePath)[1]
        .split(',')
        .map(routeName => routeName.trim())
    : [];
  return { path, routeNames };
};

export default parseCrudePath;
