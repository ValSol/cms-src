/* eslint-disable jsx-a11y/no-static-element-interactions, no-underscore-dangle */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';
import { intlShape } from 'react-intl';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import LinearProgress from 'material-ui/LinearProgress';

import { composePathWithLocale, equalArrays } from '../../../core/utils';
import { getPathForRoute } from '../../../routes/routesUtils';
import { setRuntimeVariable } from '../../../actions/runtime';
import updateExcerpt from './updateExcerpt';
import Card from './Card';

const initializeState = ({ data: { excerpt, loading } }) => ({
  submitting: false,
  // учитываем 2 ситуации 1) loading - запрос к БД еще не выполнен и excerpt не получен
  // 2) excerpt === null - если для указанных фильтров отсутствет выборка
  cards: loading || !excerpt ? [] : excerpt.items.map(_id => ({ id: _id })),
  ids: loading || !excerpt ? [] : excerpt.items,
});

class preThingFormOrderingList extends Component {
  static propTypes = {
    thingConfig: PropTypes.objectOf(
      PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
        PropTypes.object,
        PropTypes.string,
      ]),
    ).isRequired,
    data: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      excerpt: PropTypes.object,
    }).isRequired,
    filters: PropTypes.objectOf(PropTypes.string).isRequired,
    things: PropTypes.arrayOf(PropTypes.object, PropTypes.string).isRequired,
  };
  static contextTypes = {
    intl: intlShape.isRequired,
    muiTheme: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    client: PropTypes.object.isRequired,
  };

  static getDerivedStateFromProps(nextProps) {
    return initializeState(nextProps);
  }

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.dropCard = this.dropCard.bind(this);
    this.state = initializeState(props);
  }

  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];
    // используется helper update для
    // обновления состоняния
    const state = update(this.state, {
      cards: {
        $splice: [
          // выполнятся splice(dragIndex, 1)
          // то есть удалятся перетаскиваемый элемент
          [dragIndex, 1],
          // выполнятся splice(hoverIndex, 0, dragCard)
          // вставляется перетаскиваемый элемент dragCard
          // на место над которым он зависает (hover)
          [hoverIndex, 0, dragCard],
        ],
      },
    });
    this.setState(state);
  }

  async dropCard() {
    // функция обновляем данные о порядке на сервере
    // если порядок не поменялся выходим не обращаясь к серверу
    const { store } = this.context;

    const currentIds = this.state.cards.map(({ id }) => id);
    if (equalArrays(currentIds, this.state.ids)) return;

    this.setState({ submitting: true });
    // получаем с сервера обновленный порядок публикаций
    let ids;
    try {
      ids = await updateExcerpt(this.props, this.context, this.state);
    } catch (err) {
      ids = null;
    }

    if (ids) {
      const cards = ids.map(item => ({ id: item }));
      this.setState(
        {
          cards,
          ids,
          submitting: false,
        },
        () => store.dispatch(setRuntimeVariable({ name: 'error', value: '' })),
      );
    } else {
      // если ошибка получения данныйх возвращаемся к предыдущим значеним
      const cards = this.state.ids.map(item => ({ id: item }));
      this.setState(
        {
          cards,
          submitting: false,
        },
        () =>
          store.dispatch(
            setRuntimeVariable({
              name: 'error',
              value: 'DataProcessingFailure',
            }),
          ),
      );
    }
  }
  render() {
    const {
      thingConfig,
      thingConfig: { thingName },
      data: { loading },
      filters,
      things,
    } = this.props;
    const { intl: { locale }, store } = this.context;
    const { runtime: { pathname, query } } = store.getState();

    // вместо того чтобы вручную, например, articleFormPath = "/admin/articles"
    // определяем formPath, как ближайший путь для которого используется роут: articleListRoute
    const absoluteFormPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}ListRoute`,
    );
    const formPath = composePathWithLocale(absoluteFormPath, locale);
    // то же делаем для, например, роута articleDeleteRoute
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

    const { cards, submitting } = this.state;
    return (
      <div
        style={{
          /* чтобы верхний и нижний отступы как 'material-ui/List' */
          marginTop: '24px',
          marginBottom: '8px',
        }}
      >
        {loading ? (
          <LinearProgress style={{ marginTop: '40px' }} />
        ) : (
          cards.map((card, i) => {
            // находим публикацию сответствующую карточке
            const thing = things.find(item => card.id === item._id);
            return (
              <Card
                key={card.id}
                thingConfig={thingConfig}
                backLinks={thing.backLinks}
                index={i}
                id={card.id}
                title={thing.title}
                formPath={formPath}
                backLinksFormPath={backLinksFormPath}
                deleteFormPath={deleteFormPath}
                query={query}
                search
                filters={filters}
                moveCard={this.moveCard}
                dropCard={this.dropCard}
                submitting={submitting}
              />
            );
          })
        )}
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(preThingFormOrderingList);
