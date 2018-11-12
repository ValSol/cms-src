/* eslint-disable no-underscore-dangle */
import React from 'react';
import queryString from 'query-string';

import isArray from './is/isArray';
import Link2 from '../../components/Link2';

// утилита создает массив react-компонент - формирующих текстовую подписть
// item - объект содержащий params из который будет сформирована подпись
// paramNames - объект вида: { name0: [keyTranslator0, valueTranslator0],
// name1: [keyTranslator1, valueTranslator1], ... }
// где nameN - имя очередного параметра
// keyTranslatorN - функция преобразующая nameN в отображаемую строку
// valueTranslatorN - функция преобразующая item[nameN] в отображаемую строку
// если функции не заданы - никакого преобразования не требуется;
// keyColor - цвет отображения ключа параметра;
// valueColor - цвет отображения значения параметра.
// pathname - текущий путь в строке браузера - для формирования ссылок ...
// ... фильтрации по данному значению
// query - текущие параметры в строке браузера - для формирования ссылок ...
// ... фильтрации по данному значению
const composeTextWithParams = (
  item0,
  paramNames,
  keyColor,
  valueColor,
  pathname,
  query = {},
) => {
  // для единообразия обработки значений полей-справочников преобразуем ...
  // ... значение поля-справочника, которое НЕ являются массивам в массив ...
  // ... с одним элементом, например: { section: 'info' } --> { section: ['info'] }
  const item = { ...item0 };
  Object.keys(paramNames).forEach(paramName => {
    item[paramName] = isArray(item[paramName])
      ? item[paramName]
      : [item[paramName]];
  });
  const spans = [];
  Object.keys(paramNames).forEach((paramName, i) => {
    const [keyTranslator, valueTranslator] = paramNames[paramName];

    const key = keyTranslator ? keyTranslator(paramName) : paramName;
    // формитуем атрибуты span отдельно, стобы style не использовать
    // если цвет не указан
    const keySpanAttrs = { key: `key-${paramName}` };
    if (keyColor) keySpanAttrs.style = { color: keyColor };
    const keyText = (
      <span {...keySpanAttrs}>{`${i ? ', ' : ''}${key}:`}&nbsp;</span>
    );
    spans.push(keyText);

    const valueSpanAttrs = {};
    if (valueColor) valueSpanAttrs.style = { color: valueColor };

    // если указан путь, значения параметров отображаются в виде активных ...
    // ... ссылок которые позволяют фильтровать под соответствующему значению
    const valueText = item[paramName].map(
      (value, j) =>
        pathname ? (
          <span key={value}>
            {j ? ', ' : null /* null, а не '' для удобства теситрования */}
            <Link2
              href={`${pathname}?${queryString.stringify({
                ...query,
                [`filteredby${paramName}`]: value,
              })}`}
              color={valueColor}
            >
              {valueTranslator ? valueTranslator(value) : value}
            </Link2>
          </span>
        ) : (
          <span {...{ ...valueSpanAttrs, key: value }}>
            {j ? ', ' : null /* null, а не '' для удобства теситрования */}
            {valueTranslator ? valueTranslator(value) : value}
          </span>
        ),
    );

    spans.push(valueText);
  });
  return <div style={{ fontSize: '14px' }}>{spans}</div>;
};

export default composeTextWithParams;
