import React from 'react';
import FlatButton from 'material-ui/FlatButton';

import { setRuntimeVariable } from '../../../actions/runtime';
import {
  composeDefaultValue,
  composeFieldNameForForm,
  getFieldValue,
} from '../../../core/utils';
import Card from './components/Card';
import composeShowStateName from './composeShowStateName';

// вспомогательная функция добавляет новый subDocument в массив subDocument'ов
const add = (that, arrayName, attributes) => {
  const { props: { array } } = that;
  // вычисляем дерево значений по умолчанию соответствующее subDocument
  const defaultValue = composeDefaultValue(attributes);
  // добавляем новый элемент массива subDocument'ов
  array.unshift(arrayName, defaultValue);
  that.setState({ [composeShowStateName(arrayName, defaultValue.id)]: true });
};

// вспомогательная функция обеспечивает открытие диалога ...
// ... удалить / не удалять определенный subDocument
const openDeletionAlertDialog = (that, arrayName, message, i) => () => {
  that.setState({
    openAlertDialog: true,
    subDocumentArrayName: arrayName,
    subDocumentArrayNameIndex: i,
    alertDialogMessage: message,
  });
};

// вспомогательная функция удаляет card (документ) с индексом i
const toggle = (that, arrayName, id) => () => {
  const { state, props: { form, dispatch } } = that;
  const key = composeShowStateName(arrayName, id);
  const show = !state[key];
  that.setState({ [key]: show }, () =>
    dispatch(
      setRuntimeVariable({
        name: [`show:${form}:${arrayName}`],
        // устанавливаем случайное новое значени чтобы отработался метод ...
        // syncHeight в компоненте SubDocumentFieldChild
        value: Math.random(),
      }),
    ),
  );
};

const moveCard = (that, arrayName, arrayValues) => (dragIndex, hoverIndex) => {
  const { props: { array } } = that;
  const dragCard = arrayValues[dragIndex];

  // то есть удалятся перетаскиваемый элемент
  array.remove(arrayName, dragIndex);

  // вставляется перетаскиваемый элемент dragCard
  // на место над которым он зависает (hover)
  array.insert(arrayName, hoverIndex, dragCard);
};

const composeSubDocumentArray = (
  fieldsComposer,
  that,
  attributes,
  predecessors,
  name,
  // eslint-disable-next-line react/prop-types
) => {
  const {
    props: { currentValues, intl: { formatMessage, locale: lang } },
  } = that;
  const arrayName = composeFieldNameForForm(name, predecessors);
  const arrayValues = getFieldValue(currentValues, arrayName) || [];
  const { messages, subDocumentName } = attributes;
  return (
    <div>
      <FlatButton
        label={formatMessage(messages[`AddNew${subDocumentName}`])}
        onClick={() => add(that, arrayName, attributes)}
        primary
      />
      {arrayValues.map(({ id, title }, i) => (
        <div key={id}>
          <Card
            arrayName={arrayName}
            attributes={attributes}
            id={id}
            index={i}
            moveCard={moveCard(that, arrayName, arrayValues)}
            openDeletionAlertDialog={openDeletionAlertDialog(
              that,
              arrayName,
              formatMessage(messages[`Remove${subDocumentName}`]),
              i,
            )}
            submitting={false && 'submitting'}
            title={title[lang]}
            toggle={toggle(that, arrayName, id)}
          />
          <div
            style={{
              display: that.state[composeShowStateName(arrayName, id)]
                ? 'block'
                : 'none',
            }}
          >
            {fieldsComposer(that, attributes, [
              ...predecessors,
              predecessors.length ? `${name}][${i}` : `${name}[${i}]`,
            ])}
          </div>
        </div>
      ))}
    </div>
  );
};

export default composeSubDocumentArray;
