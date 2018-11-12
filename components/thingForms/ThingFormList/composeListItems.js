/* eslint-disable no-underscore-dangle */
import React from 'react';
import queryString from 'query-string';

import { ListItem } from 'material-ui/List';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import TocIcon from 'material-ui/svg-icons/action/toc';

import Link2 from '../../../components/Link2';
import {
  composeTextWithParams,
  composePathWithLocale,
  getThingNameFromItem,
  reduceI18nFields,
} from '../../../core/utils';
import { getPathForRoute } from '../../../routes/routesUtils';
import sortThingListItems from './sortThingListItems';
import { paramsMessages } from '../../../appConfig/messages';

const composeListItems = (
  itemsForSort,
  propsFromComponent,
  contextFromComponent,
) => {
  const { thingConfig, query } = propsFromComponent;
  const {
    intl: { formatMessage, locale },
    muiTheme: { palette },
    store,
  } = contextFromComponent;
  const { paramFields } = thingConfig;
  const { runtime: { pathname } } = store.getState();

  const sortedItems = sortThingListItems(thingConfig, itemsForSort, query);

  const iconHoverColor = palette.accent1Color;
  const keyColor = palette.accent3Color;
  const valueColor = palette.primary1Color;
  const translator = msg => formatMessage(paramsMessages[msg]);

  // строим конструкцию для отображения параметров и их значений, вида
  /* {
    section: [
      (sectionVaule) => formatMessage(paramsMessages[sectionVaule]),
      (sectionVaule) => formatMessage(paramsMessages[sectionVaule]),
    ]
    subject: [
      (subjectVaule) => formatMessage(paramsMessages[subjectVaule]),
      (subjectVaule) => formatMessage(paramsMessages[subjectVaule]),
    ]
  }
  */
  const paramNames = paramFields.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = [translator, translator];
    return prev;
  }, {});

  return sortedItems.map(item => {
    const { _id, title, backLinks } = reduceI18nFields(
      item,
      locale,
      thingConfig,
    );
    const thingName = getThingNameFromItem(item);
    // вместо того чтобы вручную formPath = "/admin/articles"
    // определяем formPath, как ближайший путь для которого ...
    // ... используется, например, роут: articleListRoute
    const absoluteFormPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}ListRoute`,
    );
    const formPath = composePathWithLocale(absoluteFormPath, locale);
    // то же делаем для роута deleteRoute
    const absoluteDeleteFormPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}DeleteRoute`,
    );
    const deleteFormPath = composePathWithLocale(
      absoluteDeleteFormPath,
      locale,
    );
    // то же делаем для роута backLinksRoute
    const absoluteBackLinksFormPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}BackLinksRoute`,
    );
    const backLinksFormPath = composePathWithLocale(
      absoluteBackLinksFormPath,
      locale,
    );

    // формтируем строку с параметрами запроса (отображаемую через ?)
    const search = Object.keys(query).length
      ? `?${queryString.stringify(query)}`
      : '';
    return (
      <ListItem
        key={_id}
        value={_id}
        primaryText={
          <div>
            <Link2 href={`${formPath}/${_id}${search}`}>{title}</Link2>
            {composeTextWithParams(
              item,
              paramNames,
              keyColor,
              valueColor,
              pathname,
              query,
            )}
          </div>
        }
        rightIcon={
          backLinks.length ? (
            <Link2 href={`${backLinksFormPath}/${_id}${search}`}>
              <TocIcon hoverColor={iconHoverColor} color={keyColor} />
            </Link2>
          ) : (
            <Link2 href={`${deleteFormPath}/${_id}${search}`}>
              <DeleteForeverIcon hoverColor={iconHoverColor} color={keyColor} />
            </Link2>
          )
        }
      />
    );
  });
};

export default composeListItems;
