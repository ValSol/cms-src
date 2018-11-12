/* eslint-disable no-underscore-dangle */
import React from 'react';

import { ListItem } from 'material-ui/List';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';

import Link2 from '../../../components/Link2';
import {
  composePathWithLocale,
  composeTextWithParams,
  reduceI18nFields,
} from '../../../core/utils';
import { getPathForRoute } from '../../../routes/routesUtils';
import { paramsMessages } from '../../../appConfig/messages';

const composeListItems = (propsFromComponent, contextFromComponent) => {
  const {
    thingConfig,
    thingConfig: { paramFields, thingName },
    data: { search },
    intl: { formatMessage, locale },
    pathname,
  } = propsFromComponent;
  const { muiTheme: { palette } } = contextFromComponent;

  // вместо того чтобы жестко вбивать path = "/admin/articles"
  // опеределяем path, как ближайший путь для которого используется роут: articleListRoute
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
  const deleteFormPath = composePathWithLocale(absoluteDeleteFormPath, locale);

  const iconHoverColor = palette.accent1Color;
  const keyColor = palette.accent3Color;
  const valueColor = palette.primary1Color;
  const translator = msg => formatMessage(paramsMessages[msg]);

  // конструкция для отображения параметров и их значений
  const paramNames = paramFields.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    prev[name] = [translator, translator];
    return prev;
  }, {});

  return search.map(item => {
    const { _id, title } = reduceI18nFields(item, locale, thingConfig);
    return (
      <ListItem
        key={_id}
        value={_id}
        primaryText={
          <div>
            <Link2 href={`${formPath}/${_id}`}> {title}</Link2>
            {composeTextWithParams(
              item,
              paramNames,
              keyColor,
              valueColor,
              formPath,
            )}
          </div>
        }
        rightIcon={
          <Link2 href={`${deleteFormPath}/${_id}`}>
            <DeleteForeverIcon hoverColor={iconHoverColor} color={keyColor} />
          </Link2>
        }
      />
    );
  });
};

export default composeListItems;
