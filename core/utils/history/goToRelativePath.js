import history from '../../../history';
import getBreadcrumbs from '../path/getBreadcrumbs';
/*
  Переход по относительному адресу relativePath ...
  ... с отбрасыванием backShift фрагментов
*/
const goToRelativePath = (relativePath, backShift, mustReplace) => {
  // начало
  const fragments = getBreadcrumbs(history.location.pathname).slice(
    0,
    backShift ? -backShift : undefined,
  );
  const relativePathFragments = getBreadcrumbs(relativePath);
  const path = `/${[...fragments, ...relativePathFragments].join('/')}`;
  if (mustReplace) {
    history.replace(path);
  } else {
    history.push(path);
  }
};

export default goToRelativePath;
