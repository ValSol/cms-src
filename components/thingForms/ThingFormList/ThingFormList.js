/* eslint-disable jsx-a11y/no-static-element-interactions, no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { intlShape } from 'react-intl';
// будем использовать чтобы инжектить результаты запроса в
// компоненту ThingFormOrderingList
import { graphql } from 'react-apollo';

import { plural } from 'pluralize';
import queryString from 'query-string';

import { List } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import { colors } from 'material-ui/styles';

import { goToAnotherQuery } from '../../../core/utils';
import history from '../../../history';

import composeListItems from './composeListItems';
import composeSelectFields from './composeSelectFields';
import { paramsMessages } from '../../../appConfig/messages';
import validationMessages from '../../validationMessages';
import formListMessages from './formListMessages';
import filterItems from './filterItems';
import extractFromQuery from './extractFromQuery';
import ThingFormOrderingList from '../ThingFormOrderingList';
import ThingFormOrderingList2 from '../ThingFormOrderingList2';
import composeExcerpt from '../../../core/gql/composeExcerpt.gql';

const handleChangeSortSelectField = (value, thingConfig, params) => {
  const { defaultSortingOptionName } = thingConfig;
  const query = queryString.parse(history.location.search);
  const { thereIsExcerpt } = extractFromQuery(thingConfig, params, query);
  const { sortedby, ...rest } = query;
  // в качестве используемого по умолчанию атрибута сортировки принимаем:
  // или 1) defaultSortingOptionName полученный из thingConfig
  // или 2) 'orderliness' - если упорядочивание вручную
  const defaultName = thereIsExcerpt ? 'orderliness' : defaultSortingOptionName;
  // формируем обновленный набор параметров в строке браузера ...
  // ... с учетом значений по умолчанию
  const newQuery = value === defaultName ? rest : { ...rest, sortedby: value };
  goToAnotherQuery(newQuery);
};
const handleChangeCheckbox = (event, value) => {
  const { ordering, ...query } = queryString.parse(history.location.search);
  // чтобы в строке отображалось ТОЛЬКО ИМЯ параметра указываем: ordering: null
  const newQuery = value ? { ...query, ordering: null } : query;
  goToAnotherQuery(newQuery);
};

const style = {
  extraSmallSelectField: {
    marginTop: '16px',
  },
  selectField: {
    float: 'right',
    marginTop: '-56px',
    width: '232px',
  },
  errorSelectField: {
    float: 'right',
    marginTop: '-40px',
    width: '232px',
  },
};

const ThingFormList = (props, context) => {
  const {
    dragAndDropOrdering,
    error,
    mediaType,
    params,
    query,
    thingConfig,
    things,
    title: listTitle,
    useOrderlinessSortOption,
  } = props;
  const { intl: { formatMessage, locale } } = context;
  const { defaultSortingOptionName, sortingOptions, thingName } = thingConfig;

  // отфильтровываем things в соответствии с значением атрибутов в query
  const filteredThings = filterItems(thingConfig, params, things, query);

  // необходимый данные из query получаем выполенинем одной утилиты
  const { checked, filters, thereIsExcerpt } = extractFromQuery(
    thingConfig,
    params,
    query,
  );

  // ----------------------------------------------------------------

  // формируем данный для выпадающего списка сотрировки

  // получаем menuItems для выпадающего списка сортировки items
  const sortMenuItems = sortingOptions.map(({ name }) => (
    <MenuItem
      key={name}
      value={name}
      primaryText={formatMessage(paramsMessages[`${name}FilterKey`])}
    />
  ));

  // если thereIsExcerpt = true - т.е. набор фильтров отфильтровывает
  // УПОРЯДОЧИВАЕМУЮ вручную выборку,
  // добавляем уще один способ упорядочивания: By Orderliness (По Порядку)
  if (thereIsExcerpt && useOrderlinessSortOption) {
    sortMenuItems.unshift(
      <MenuItem
        key="orderliness"
        value="orderliness"
        primaryText={formatMessage(paramsMessages.orderliness)}
      />,
    );
  }

  // определяем текущее значение выпадающего списка сортировки sortedBy ...
  // ... с учетом (если thereIsExcerpt) упорядочивания вручную
  const sortedBy = sortingOptions.reduce((prev, { name }) => {
    // eslint-disable-next-line no-param-reassign
    if (name === query.sortedby) prev = name;
    return prev;
  }, thereIsExcerpt && useOrderlinessSortOption ? 'orderliness' : defaultSortingOptionName);

  // -----------------------------------------------------------------------

  // формируем собственно список listOfThings

  let listOfThings;
  if (dragAndDropOrdering && thereIsExcerpt && checked) {
    // если включен режим упорядочивания перетягиванием - формируем компоненту
    // которая будет выполнять эту функцию и подтягивать данные gql запросом
    const queryExcerpt = composeExcerpt(thingConfig);
    const ThingFormOrderingListWithData = graphql(queryExcerpt, {
      options: ({ filters: curFilters }) => ({
        variables: { ...curFilters },
      }),
    })(ThingFormOrderingList);
    listOfThings = (
      <ThingFormOrderingListWithData
        thingConfig={thingConfig}
        filters={filters}
        things={filteredThings.map(({ _id, title, backLinks }) => ({
          _id,
          backLinks,
          title: title[locale],
        }))}
      />
    );
  } else if (useOrderlinessSortOption && thereIsExcerpt && !query.sortedby) {
    // если используем сортировку и режим упорядочивания перетягиванием
    // который является в этом случае по умолчанию - формируем компоненту
    // которая будет выполнять эту функцию и подтягивать данные gql запросом
    const queryExcerpt = composeExcerpt(thingConfig);
    const ThingFormOrderingList2WithData = graphql(queryExcerpt, {
      options: ({ filters: curFilters }) => ({
        variables: { ...curFilters },
      }),
    })(ThingFormOrderingList2);
    listOfThings = (
      <ThingFormOrderingList2WithData
        thingConfig={thingConfig}
        filters={filters}
        query={query}
        things={filteredThings}
      />
    );
  } else {
    // если такой режим не включен просто получаем для отображения
    // упорядоченный по заданным критерями список
    listOfThings = (
      <List id={`${thingName}ListForm:List`}>
        {composeListItems(filteredThings, props, context, thereIsExcerpt)}
      </List>
    );
  }

  // -----------------------------------------------------------------------

  return (
    <div>
      <h1>{listTitle}</h1>
      {error && (
        <Divider
          style={{ marginTop: '16px', backgroundColor: colors.red500 }}
        />
      )}
      {error && (
        <div style={{ color: colors.red500, marginTop: '8px' }}>
          {formatMessage(validationMessages[error])}
        </div>
      )}
      {dragAndDropOrdering && thereIsExcerpt && checked ? null : (
        <SelectField
          id={`OrderedBySelectFieldFor${plural(thingName)}`}
          floatingLabelText={formatMessage(formListMessages.OrderedBy)}
          value={sortedBy}
          onChange={(event, index, value) =>
            handleChangeSortSelectField(value, thingConfig, params)
          }
          style={
            // eslint-disable-next-line no-nested-ternary
            mediaType === 'extraSmall' || mediaType === 'small'
              ? style.extraSmallSelectField
              : error ? style.errorSelectField : style.selectField
          }
          autoWidth
        >
          {sortMenuItems}
        </SelectField>
      )}
      <div>{composeSelectFields(params, things, props, context)}</div>
      {dragAndDropOrdering &&
        thereIsExcerpt && (
          <Checkbox
            checked={checked}
            label={formatMessage(formListMessages.OrderingByDrugAndDrop)}
            onCheck={handleChangeCheckbox}
            style={{ marginBottom: '16px' }}
          />
        )}
      {listOfThings}
    </div>
  );
};

ThingFormList.propTypes = {
  dragAndDropOrdering: PropTypes.bool,
  error: PropTypes.string,
  mediaType: PropTypes.string.isRequired,
  params: PropTypes.objectOf(PropTypes.array).isRequired,
  query: PropTypes.objectOf(PropTypes.string).isRequired,
  thingConfig: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
  ).isRequired,
  things: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  useOrderlinessSortOption: PropTypes.bool,
};

ThingFormList.defaultProps = {
  dragAndDropOrdering: false,
  error: '',
  useOrderlinessSortOption: false,
};

ThingFormList.contextTypes = {
  client: PropTypes.object.isRequired, // ??? а нужен?
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  // чтобы не навешивать connect ради получение pathname из store
  // использовать будем в composeListItems
  store: PropTypes.object.isRequired,
};

const mapStateToProps = ({ browser: { mediaType }, runtime: { error } }) => ({
  error,
  mediaType,
});

export default connect(mapStateToProps)(ThingFormList);
