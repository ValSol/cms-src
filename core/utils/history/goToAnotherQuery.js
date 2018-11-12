import queryString from 'query-string';

import history from '../../../history';
/*
  Переход на тот же адрес, но со сменой параметров задаваемых объектом query
*/

const goToAnotherQuery = (query = {}) => {
  // получаем строку поиска (если она была)
  const search = Object.keys(query).length
    ? `?${queryString.stringify(query)}`
    : '';
  history.push(`${history.location.pathname}${search}`);
};

export default goToAnotherQuery;
