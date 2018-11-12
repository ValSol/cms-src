// функция возвращает массив содержащий сегменты
// соответствующие указанному пути
// path - путь из которого получаются breadcrumbs
const getBreadcrumbs = path =>
  path
    .toString()
    .split('/')
    .filter(Boolean);

export default getBreadcrumbs;
