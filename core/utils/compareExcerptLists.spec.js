/* eslint-env jest */

import compareExcerptLists from './compareExcerptLists';

describe('compareExcerptLists util', () => {
  test('should return simple arrays results', () => {
    const arr1 = [1, 2, 3, 4, 5];
    const arr2 = [7, 6, 5, 3, 1];
    const expectedResult = {
      forAdd: [7, 6],
      forRemove: [2, 4],
    };
    const result = compareExcerptLists(arr1, arr2);
    expect(result).toEqual(expectedResult);
  });
  test('should return realistic excerpt arrays results', () => {
    const arr1 = [
      { paramNames: JSON.stringify([]) },
      { paramNames: JSON.stringify(['subject']), subject: 'patent' },
      { paramNames: JSON.stringify(['subject']), subject: 'trademark' },
      { paramNames: JSON.stringify(['subject']), subject: 'copyright' },
      { paramNames: JSON.stringify(['section']), section: 'info' },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'patent',
      },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'trademark',
      },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'copyright',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'patent',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'trademark',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'copyright',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'patent',
        genre: 'interview',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'trademark',
        genre: 'interview',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'copyright',
        genre: 'interview',
      },
    ];
    const arr2 = [
      { paramNames: JSON.stringify([]) },
      { paramNames: JSON.stringify(['subject']), subject: 'design' },
      { paramNames: JSON.stringify(['subject']), subject: 'trademark' },
      { paramNames: JSON.stringify(['subject']), subject: 'copyright' },
      { paramNames: JSON.stringify(['section']), section: 'info' },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'design',
      },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'trademark',
      },
      {
        paramNames: JSON.stringify(['section', 'subject']),
        section: 'info',
        subject: 'copyright',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'design',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'trademark',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'copyright',
        genre: 'report',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'design',
        genre: 'interview',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'trademark',
        genre: 'interview',
      },
      {
        paramNames: JSON.stringify(['genre', 'section', 'subject']),
        section: 'info',
        subject: 'copyright',
        genre: 'interview',
      },
    ];
    const expectedResult = {
      forAdd: [
        { paramNames: JSON.stringify(['subject']), subject: 'design' },
        {
          paramNames: JSON.stringify(['section', 'subject']),
          section: 'info',
          subject: 'design',
        },
        {
          paramNames: JSON.stringify(['genre', 'section', 'subject']),
          section: 'info',
          subject: 'design',
          genre: 'report',
        },
        {
          paramNames: JSON.stringify(['genre', 'section', 'subject']),
          section: 'info',
          subject: 'design',
          genre: 'interview',
        },
      ],
      forRemove: [
        { paramNames: JSON.stringify(['subject']), subject: 'patent' },
        {
          paramNames: JSON.stringify(['section', 'subject']),
          section: 'info',
          subject: 'patent',
        },
        {
          paramNames: JSON.stringify(['genre', 'section', 'subject']),
          section: 'info',
          subject: 'patent',
          genre: 'report',
        },
        {
          paramNames: JSON.stringify(['genre', 'section', 'subject']),
          section: 'info',
          subject: 'patent',
          genre: 'interview',
        },
      ],
    };
    const result = compareExcerptLists(arr1, arr2);
    expect(result).toEqual(expectedResult);
  });
});
