/* eslint-env jest */
import React from 'react';

import Link2 from '../../components/Link2';
import composeTextWithParams from './composeTextWithParams';

describe('composeTextWithParams', () => {
  test('should render text with params', () => {
    const item = { subject: ['patent'], section: ['info'] };
    const paramNames = { subject: [], section: [] };
    const keyColor = 'green';
    const valueColor = 'red';
    const result = composeTextWithParams(
      item,
      paramNames,
      keyColor,
      valueColor,
    );
    const expectedResult = (
      <div style={{ fontSize: '14px' }}>
        <span style={{ color: 'green' }} key="key-subject">
          {'subject:'}&nbsp;
        </span>
        {[
          <span style={{ color: 'red' }} key="patent">
            {null}
            patent
          </span>,
        ]}
        <span style={{ color: 'green' }} key="key-section">
          {', section:'}&nbsp;
        </span>
        {[
          <span style={{ color: 'red' }} key="info">
            {null}
            info
          </span>,
        ]}
      </div>
    );
    expect(result).toEqual(expectedResult);
  });
  test('should render text with translated params', () => {
    const item = { subject: ['patent'], section: ['info'] };
    const keyColor = 'green';
    const valueColor = 'red';
    // формируем stub для значения / функции интернационализации
    const messages = {
      subject: 'тема',
      section: 'раздел',
      patent: 'изобретения',
      info: 'информация',
    };
    const translator = message => messages[message];
    const paramNames = {
      subject: [translator, translator],
      section: [translator, translator],
    };
    const result = composeTextWithParams(
      item,
      paramNames,
      keyColor,
      valueColor,
    );
    const expectedResult = (
      <div style={{ fontSize: '14px' }}>
        <span style={{ color: 'green' }} key="key-subject">
          {'тема:'}&nbsp;
        </span>
        {[
          <span style={{ color: 'red' }} key="patent">
            {null}
            изобретения
          </span>,
        ]}
        <span style={{ color: 'green' }} key="key-section">
          {', раздел:'}&nbsp;
        </span>
        {[
          <span style={{ color: 'red' }} key="info">
            {null}
            информация
          </span>,
        ]}
      </div>
    );
    expect(result).toEqual(expectedResult);
  });
  test('should render text without colors', () => {
    const item = { subject: ['patent'], section: ['info'] };
    // формируем stub для значения / функции интернационализации
    const messages = {
      subject: 'тема',
      section: 'раздел',
      patent: 'изобретения',
      info: 'информация',
    };
    const translator = message => messages[message];
    const paramNames = {
      subject: [translator, translator],
      section: [translator, translator],
    };
    const result = composeTextWithParams(item, paramNames);
    const expectedResult = (
      <div style={{ fontSize: '14px' }}>
        <span key="key-subject">{'тема:'}&nbsp;</span>
        {[<span key="patent">{null}изобретения</span>]}
        <span key="key-section">{', раздел:'}&nbsp;</span>
        {[<span key="info">{null}информация</span>]}
      </div>
    );
    expect(result).toEqual(expectedResult);
  });
  test('should render text with translated params and Links', () => {
    const item = { subject: ['patent'], section: ['info'] };
    const keyColor = 'green';
    const valueColor = 'red';
    // формируем stub для значения / функции интернационализации
    const messages = {
      subject: 'тема',
      section: 'раздел',
      patent: 'изобретения',
      info: 'информация',
    };
    const translator = message => messages[message];
    const paramNames = {
      subject: [translator, translator],
      section: [translator, translator],
    };
    const pathname = '/ru/admin/articles';
    const query = {};
    const result = composeTextWithParams(
      item,
      paramNames,
      keyColor,
      valueColor,
      pathname,
      query,
    );
    const expectedResult = (
      <div style={{ fontSize: '14px' }}>
        <span style={{ color: 'green' }} key="key-subject">
          {'тема:'}&nbsp;
        </span>
        {[
          <span key="patent">
            {null}
            <Link2
              href="/ru/admin/articles?filteredbysubject=patent"
              color="red"
            >
              изобретения
            </Link2>
          </span>,
        ]}
        <span style={{ color: 'green' }} key="key-section">
          {', раздел:'}&nbsp;
        </span>
        {[
          <span key="info">
            {null}
            <Link2 href="/ru/admin/articles?filteredbysection=info" color="red">
              информация
            </Link2>
          </span>,
        ]}
      </div>
    );
    expect(result).toEqual(expectedResult);
  });
  test('should render text with several translated params in array', () => {
    const item = { subject: ['patent', 'copyright'], section: 'info' };
    const keyColor = 'green';
    const valueColor = 'red';
    // формируем stub для значения / функции интернационализации
    const messages = {
      subject: 'тема',
      section: 'раздел',
      patent: 'изобретения',
      copyright: 'авторские права',
      info: 'информация',
    };
    const translator = message => messages[message];
    const paramNames = {
      subject: [translator, translator],
      section: [translator, translator],
    };
    const pathname = '/ru/admin/articles';
    const query = {};
    const result = composeTextWithParams(
      item,
      paramNames,
      keyColor,
      valueColor,
      pathname,
      query,
    );
    const expectedResult = (
      <div style={{ fontSize: '14px' }}>
        <span style={{ color: 'green' }} key="key-subject">
          {'тема:'}&nbsp;
        </span>
        {[
          <span key="patent">
            {null}
            <Link2
              href="/ru/admin/articles?filteredbysubject=patent"
              color="red"
            >
              изобретения
            </Link2>
          </span>,
          <span key="copyright">
            {', ' /* для второго и далее значений добавляем запятую */}
            <Link2
              href="/ru/admin/articles?filteredbysubject=copyright"
              color="red"
            >
              авторские права
            </Link2>
          </span>,
        ]}
        <span style={{ color: 'green' }} key="key-section">
          {', раздел:'}&nbsp;
        </span>
        {[
          <span key="info">
            {null}
            <Link2 href="/ru/admin/articles?filteredbysection=info" color="red">
              информация
            </Link2>
          </span>,
        ]}
      </div>
    );
    expect(result).toEqual(expectedResult);
  });
});
