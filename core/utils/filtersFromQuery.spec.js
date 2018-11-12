/* eslint-env jest */
import filtersFromQuery from './filtersFromQuery';

describe('ArticleFormList Util filtersFromQuery', () => {
  const params = {
    subject: ['trademark', 'copyright', 'patent', 'design'],
    section: ['info', 'services'],
  };
  test('should return empty object for empty query', () => {
    const query = {};
    const result = filtersFromQuery(query, params);
    const expectedResult = {};
    expect(result).toEqual(expectedResult);
  });
  test('should return empty object for empty query', () => {
    const query = { sortedby: 'subject' };
    const result = filtersFromQuery(query, params);
    const expectedResult = {};
    expect(result).toEqual(expectedResult);
  });
  test('should return object with subject key', () => {
    const query = { filteredbysubject: 'patent', sortedby: 'subject' };
    const result = filtersFromQuery(query, params);
    const expectedResult = { subject: 'patent' };
    expect(result).toEqual(expectedResult);
  });
  test('should return empty object for query with incorrect value', () => {
    const query = { filteredbysubject: 'patent2', sortedby: 'subject' };
    const result = filtersFromQuery(query, params);
    const expectedResult = {};
    expect(result).toEqual(expectedResult);
  });
  test('should return object with subject and section keys', () => {
    const query = {
      filteredbysubject: 'patent',
      filteredbysection: 'info',
      sortedby: 'subject',
    };
    const result = filtersFromQuery(query, params);
    const expectedResult = { subject: 'patent', section: 'info' };
    expect(result).toEqual(expectedResult);
  });
});

export default filtersFromQuery;
