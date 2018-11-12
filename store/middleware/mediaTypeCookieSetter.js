// middleware перехватывает action у которого type 'redux-responsive/CALCULATE_RESPONSIVE_STATE'
//  сохраняет в куках значения mediaType ...
// ...для использования на сервере (файл: src/server.js)
// -------------------------------------------------------------

const mediaTypeCookieSetter = store => next => action => {
  const result = next(action);

  if (
    action.type === 'redux-responsive/CALCULATE_RESPONSIVE_STATE' &&
    process.env.BROWSER
  ) {
    const { mediaType } = store.getState().browser;
    const maxAge = 3650 * 24 * 3600; // 10 years in seconds
    document.cookie = `mediaType=${mediaType};path=/;max-age=${maxAge}`;
  }
  return result;
};
// -------------------------------------------------------------

export default mediaTypeCookieSetter;
