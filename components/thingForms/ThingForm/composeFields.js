import React from 'react';
import { Field } from 'redux-form';
// import MenuItem from 'material-ui/MenuItem';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

import ReduxTextField from '../../reduxFormFields/ReduxTextField';
import ReduxPicturesSelectField from '../../reduxFormFields/ReduxPicturesSelectField';
import ReduxSelectField from '../../reduxFormFields/ReduxSelectField';
import SubDocumentField from './components/SubDocumentField';

import { params } from '../../../appConfig';
import { composeFieldNameForForm } from '../../../core/utils';
import normalizeFloat from './normalizeFloat';
import normalizeSlug from './normalizeSlug';
import I18nFields from './components/I18nFields';
import composeSubDocumentArray from './composeSubDocumentArray';
import {
  fieldNamesMessages,
  paramsMessages,
} from '../../../appConfig/messages';

const composeFields = (
  that,
  thingConfigOrSubDocumentAttributes = that.props.thingConfig,
  predecessors = [],
) => {
  const {
    props: propsOfThingForm,
    props: {
      intl: { formatMessage, locale: lang },
      // чтобы при переключении select'ов - обновлять AsyncErrors для поля slug
      clearAsyncError,
      currentValues,
      form,
      mediaType,
      thingConfig: { thingName },
    },
  } = that;
  // получаем параметры полей текущие
  const {
    compoundIndexFieldSets,
    i18nFields,
    orderOfTheFormFields,
    paramFields,
    subDocumentName,
  } = thingConfigOrSubDocumentAttributes;
  const { _id } = currentValues;

  // form прдставляется в виде  "ArticleForm:formActionType"
  // например "formActionType:delete" для удобства вычленяем formActionType
  // eslint-disable-next-line no-unused-vars
  const [foo, formActionType] = form.split(':');
  // готовим массив имен параметров, например: ['subject', 'section']
  const paramFieldNames = paramFields.map(({ name }) => name);

  // строка дополнительной идентифицируещей инфомрации о поле
  // для использования в id и key
  const predecessorsString = predecessors.map(item => `${item}:`).join('');

  // ВНИМАНИЕ - пока используется ТОЛЬКО несколько видов полей:
  // numberFields, paramFields, specialFields, subDocumentFields, textFields
  // при использование других полей нужно добавить (TODO) их обработку ...
  // ... в нижележащую функцию .map
  const ordinaryFormFields = orderOfTheFormFields.map(
    ({ name, kind, array, multiple, required, attributes }) => {
      const nameForLabel = subDocumentName
        ? `${name}Of${subDocumentName}`
        : name;
      const fieldLabel = `${'•'.repeat(predecessors.length)} ${formatMessage(
        // перевод находтися в одном из 2-х массивов
        fieldNamesMessages[nameForLabel] || paramsMessages[nameForLabel],
      )}`;
      if (kind === 'paramFields') {
        // если поле-справочник
        const menuItems = params[name].map(value => {
          // если список с множественным выбором - указываем порядковые номера
          const serialNumber =
            multiple &&
            currentValues[name] &&
            currentValues[name].indexOf(value) + 1;
          return (
            <MenuItem value={value} key={value}>
              <ListItemText
                primary={`${formatMessage(paramsMessages[value])}${
                  serialNumber ? ` (${serialNumber})` : ''
                }`}
              />
            </MenuItem>
          );
        });
        // получаем имена полей сообщение об ошибках в которых ...
        // ... должны очищаться при изменении данного поля-справочника ...
        // ... т.е. те поля не справочники которые входят в сложные индексы ...
        // ... в которые входит и текущие поле-справочник
        const notParamFieldNames = compoundIndexFieldSets
          .filter(set =>
            set.some(({ name: indexFieldName }) => indexFieldName === name),
          )
          .reduce((prev, set) => {
            set.forEach(({ name: indexFieldName }) => {
              if (
                !paramFieldNames.includes(indexFieldName) &&
                !prev.includes(indexFieldName)
              ) {
                prev.push(indexFieldName);
              }
            });
            return prev;
          }, []);

        return (
          <div key={`${form}:select:${predecessorsString}${name}`}>
            <Field
              id={`${form}:select:${predecessorsString}${name}`}
              component={ReduxSelectField}
              disabled={
                formActionType === 'delete' || formActionType === 'recover'
              }
              name={composeFieldNameForForm(name, predecessors)}
              onChange={() =>
                notParamFieldNames.forEach(fieldName =>
                  clearAsyncError(fieldName),
                )
              }
              label={fieldLabel}
              fullWidth={multiple}
              multiple={multiple}
              required={required}
            >
              {menuItems}
            </Field>
          </div>
        );
      } else if (kind === 'textFields') {
        return (
          <div key={`${form}:text:${predecessorsString}${name}`}>
            <Field
              component={ReduxTextField}
              id={`${form}:text:${predecessorsString}${name}`}
              name={composeFieldNameForForm(name, predecessors)}
              label={fieldLabel}
              required={required}
              disabled={
                formActionType === 'delete' || formActionType === 'recover'
              }
            />
          </div>
        );
      } else if (kind === 'numberFields') {
        return (
          <div key={`${form}:number:${predecessorsString}${name}`}>
            <Field
              id={`${form}:number:${predecessorsString}${name}`}
              component={ReduxTextField}
              required={required}
              disabled={
                formActionType === 'delete' || formActionType === 'recover'
              }
              name={composeFieldNameForForm(name, predecessors)}
              label={fieldLabel}
              normalize={normalizeFloat}
              type="number"
            />
          </div>
        );
      } else if (kind === 'subDocumentFields') {
        return (
          <div key={`${form}:SubDocument:${predecessorsString}${name}`}>
            <SubDocumentField
              id={`${form}:subDocument:${predecessorsString}${name}`}
              floatingLabelText={formatMessage(fieldNamesMessages[name])}
              form={form}
              fullWidth
              mediaType={mediaType}
              name={composeFieldNameForForm(name, predecessors)}
            >
              {array
                ? composeSubDocumentArray(
                    // передаем функцию composeFields чтобы компонвать поля ...
                    // ... нижестоящие по иерархи
                    composeFields,
                    // передаем аргументы для функции composeFields
                    that,
                    attributes,
                    predecessors,
                    // передаем собственное имя текущего поля
                    name,
                  )
                : composeFields(that, attributes, [...predecessors, name])}
            </SubDocumentField>
          </div>
        );
      } else if (kind === 'specialFields') {
        if (name === 'slug') {
          return (
            <div key={`${form}:text:slug`}>
              <Field
                id={`${form}:text:slug`}
                name={name}
                label={formatMessage(fieldNamesMessages.slug)}
                component={ReduxTextField}
                disabled={
                  formActionType === 'delete' || formActionType === 'recover'
                }
                normalize={normalizeSlug}
                required={required}
                fullWidth
                validateUnTouched
              />
            </div>
          );
        } else if (name === 'pictures') {
          return (
            <div key={`pictures${thingName}Form-${lang}`}>
              <Field
                // без указания key зависящего от lang ...
                // ... не всегда работаем переключения языков
                key={`pictures${thingName}Form-${lang}`}
                id={`${form}:pictures`}
                _id={_id || ''} // использутеся при загрузке картинок на сервер
                name={name}
                label={formatMessage(fieldNamesMessages.pictures)}
                component={ReduxPicturesSelectField}
                disabled={
                  formActionType === 'delete' || formActionType === 'recover'
                }
              />
            </div>
          );
        }
        throw new TypeError(`Uknown special field name "${name}"!`);
      }
      throw new TypeError(`Uknown field kind "${kind}"!`);
    },
  );
  const i18nFormFields = i18nFields.length ? (
    <I18nFields
      {...propsOfThingForm}
      predecessors={predecessors}
      thingConfigOrSubDocumentAttributes={thingConfigOrSubDocumentAttributes}
    />
  ) : null;

  return (
    <div>
      {ordinaryFormFields}
      {i18nFormFields}
    </div>
  );
};

export default composeFields;
