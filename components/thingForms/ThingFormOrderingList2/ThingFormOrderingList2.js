/* eslint-disable jsx-a11y/no-static-element-interactions, no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import queryString from 'query-string';

import { List, ListItem } from 'material-ui/List';
import DeleteForeverIcon from 'material-ui/svg-icons/action/delete-forever';
import TocIcon from 'material-ui/svg-icons/action/toc';
import LinearProgress from 'material-ui/LinearProgress';

import Link2 from '../../../components/Link2';
import {
  composeTextWithParams,
  composePathWithLocale,
  reduceI18nFields,
} from '../../../core/utils';
import { getPathForRoute } from '../../../routes/routesUtils';
import { paramsMessages } from '../../../appConfig/messages';

const ThingFormOrderingList2 = (props, context) => {
  const { thingConfig, data: { excerpt, loading }, query, things } = props;
  const {
    intl: { formatMessage, locale },
    muiTheme: { palette },
    store,
  } = context;
  const { paramFields, thingName } = thingConfig;
  const { runtime: { pathname } } = store.getState();

  if (loading) return <LinearProgress style={{ marginTop: '40px' }} />;

  // ---------------------------------------------------------
  // пересортировываем отображаемый список в соостветствии ...
  // ... с порядком установленным вручную

  // формируем словарь всех задействованных things c доступом по _id
  const thingsObject = things.reduce((prev, thing) => {
    // eslint-disable-next-line no-param-reassign
    prev[thing._id] = thing;
    return prev;
  }, {});
  // если excerpt === null т.е. ничего не найдено для указанных параметров ...
  // будет отображаться пустой список
  const orderingThings = excerpt
    ? excerpt.items.map(id => thingsObject[id])
    : [];

  // ---------------------------------------------------------

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
  const deleteFormPath = composePathWithLocale(absoluteDeleteFormPath, locale);
  // то же делаем для роута backLinksRoute
  const absoluteBackLinksFormPath = getPathForRoute(
    pathname,
    `${thingName.toLowerCase()}BackLinksRoute`,
  );
  const backLinksFormPath = composePathWithLocale(
    absoluteBackLinksFormPath,
    locale,
  );

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
  return (
    <List id={`${thingName}ListForm:List`}>
      {orderingThings.map(item => {
        const { _id, backLinks, title } = reduceI18nFields(
          item,
          locale,
          thingConfig,
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
                  <DeleteForeverIcon
                    hoverColor={iconHoverColor}
                    color={keyColor}
                  />
                </Link2>
              )
            }
          />
        );
      })}
    </List>
  );
};

ThingFormOrderingList2.propTypes = {
  thingConfig: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
  ).isRequired,
  query: PropTypes.objectOf(PropTypes.string).isRequired,
  data: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    excerpt: PropTypes.object,
  }).isRequired,
  things: PropTypes.arrayOf(PropTypes.object, PropTypes.string).isRequired,
};

ThingFormOrderingList2.contextTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default ThingFormOrderingList2;
