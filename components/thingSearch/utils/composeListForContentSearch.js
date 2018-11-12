/* eslint-disable no-underscore-dangle */
import React from 'react';

import { ListItem } from 'material-ui/List';

import Link2 from '../../../components/Link2';
import {
  composePathWithLocale,
  composeTextWithParams,
  reduceI18nFields,
} from '../../../core/utils';
import { paramsMessages } from '../../../appConfig/messages';

const composeListItems = (propsFromComponent, contextFromComponent) => {
  const {
    thingConfig,
    thingConfig: { getThingPermanentPath, paramFields },
    data: { search },

    intl: { formatMessage, locale },
  } = propsFromComponent;
  const { muiTheme: { palette } } = contextFromComponent;

  return !search
    ? null
    : search.map(item => {
        const item2 = reduceI18nFields(item, locale, thingConfig);
        const keyColor = palette.accent3Color;
        const valueColor = palette.primary2Color;
        const translator = msg => formatMessage(paramsMessages[msg]);
        const href = composePathWithLocale(
          getThingPermanentPath(item2),
          locale,
        );
        // конструкция для отображения параметров и их значений
        const paramNames = paramFields.reduce((prev, { name }) => {
          // eslint-disable-next-line no-param-reassign
          prev[name] = [translator, translator];
          return prev;
        }, {});

        return (
          <ListItem
            key={item._id}
            value={item._id}
            primaryText={
              <div>
                <Link2 href={href}>{item2.title}</Link2>
              </div>
            }
            secondaryText={composeTextWithParams(
              item,
              paramNames,
              keyColor,
              valueColor,
            )}
          />
        );
      });
};

export default composeListItems;
