/* eslint-disable no-underscore-dangle */
import React from 'react';
import { ListItem } from 'material-ui/List';

import Link2 from '../../Link2';

const composeListItems = listHierarchy => {
  const listItems = listHierarchy.map(
    ({ value, nestedItems, primaryText, ...rest }) => {
      const result = (
        <ListItem
          {...rest}
          nestedItems={composeListItems(nestedItems || [])}
          value={value}
          primaryText={
            !nestedItems ? (
              <div>
                <Link2 href={value}>{primaryText}</Link2>
              </div>
            ) : (
              primaryText
            )
          }
          primaryTogglesNestedList={!!nestedItems}
        />
      );
      return result;
    },
  );
  return listItems;
};

export default composeListItems;
