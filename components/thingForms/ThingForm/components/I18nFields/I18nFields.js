import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'react-intl';
import { Field } from 'redux-form';
import { Tab, Tabs } from 'material-ui/Tabs';
import SwipeableViews from 'react-swipeable-views';

import queryString from 'query-string';

import ReduxTextField from '../../../../../components/reduxFormFields/ReduxTextField';
import ReduxRichTextField from '../../../../../components/reduxFormFields/ReduxRichTextField';

import { locales } from '../../../../../appConfig';
import { composeFieldNameForForm } from '../../../../../core/utils';
import { getPathForRoute } from '../../../../../routes/routesUtils';
import normalizeOnBlurTitle from '../../normalizeOnBlurTitle';
import {
  fieldNamesMessages,
  langMessages,
} from '../../../../../appConfig/messages';
// import asyncValidate from './asyncValidate';

class I18nFields extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      styles: {
        0: { transition: 'all 0.45s ease-in-out' },
        1: { backgroundColor: 'lightGrey', marginBottom: '2px' },
        2: { backgroundColor: 'lightGrey', marginBottom: '2px' },
      },
    };
    this.handleTabChange = this.handleTabChange.bind(this);
  }
  handleTabChange(tabIndex) {
    const styles = { ...this.state.styles };
    styles[this.state.tabIndex] = {
      backgroundColor: 'lightGrey',
      marginBottom: '2px',
    };
    styles[tabIndex] = { transition: 'all 0.45s ease-in-out' };
    this.setState({ tabIndex, styles });
  }
  render() {
    const { formatMessage } = this.props.intl;
    const {
      change, // чтобы из richTextFields менять поле pictures
      thingConfigOrSubDocumentAttributes: {
        i18nFields,
        richTextFields,
        subDocumentName,
      },
      thingConfig: { thingName },
      currentValues, // чтобы из richTextFields получать поле pictures
      form,
      initialValues: { _id },
      mediaType,
      pathname,
      predecessors,
      query,
      pristine,
      valid,
    } = this.props;

    // form прдставляется в виде  "ArticleForm:formActionType"
    // например "formActionType:delete" для удобства вычленяем formActionType
    // eslint-disable-next-line no-unused-vars
    const [foo, formActionType] = form.split(':');

    // вместо того чтобы вручную articleRichTextRoutePath = "/admin/articles/richtext"
    // опеределяем articleRichTextRoutePath, как ближайший путь
    // для которого используется роут: articleRichTextRoute
    const absoluteContentEditorPath = getPathForRoute(
      pathname,
      `${thingName.toLowerCase()}RichTextRoute`,
    );

    // формируем строку с параметрами для адреса
    const search = Object.keys(query).length
      ? `?${queryString.stringify(query)}`
      : '';

    // существенное ЗАМЕЧАНИЕ
    // для каждого поля формы указывается id вида
    // formName:fieldType:fieldName:locales
    // id в целом и fieldType в частности - используются в e2e тестах
    // сегменты locales, fieldName - не обязательны

    // строка дополнительной идентифицируещей инфомрации о поле
    // для использования в id и key
    const predecessorsString = predecessors.map(item => `${item}:`).join('');
    // формируем поля присуствующие в различных локалях
    const fieldsSet = locales.map(locale => (
      <div
        id={`${locale}${thingName}Form`}
        key={locale}
        style={{ overflowY: 'hidden' }} // чтобы не отображался scrollbar
      >
        {i18nFields.map(({ name, required }) => {
          const nameForLabel = subDocumentName
            ? `${name}Of${subDocumentName}`
            : name;
          const fieldLabel = `${'•'.repeat(
            predecessors.length,
          )} ${formatMessage(fieldNamesMessages[nameForLabel])}`;
          return (
            <div key={`${name}:${predecessorsString}${locale}`}>
              {!richTextFields.includes(name) ? (
                <Field
                  id={`${form}:text:${predecessorsString}${name}:${locale}`}
                  name={`${composeFieldNameForForm(
                    name,
                    predecessors,
                  )}[${locale}]`}
                  label={fieldLabel}
                  component={ReduxTextField}
                  disabled={
                    formActionType === 'delete' || formActionType === 'recover'
                  }
                  normalizeOnBlur={normalizeOnBlurTitle}
                  required={required}
                  fullWidth={!(name === 'shortTitle')}
                />
              ) : (
                <Field
                  id={`${form}:richText:${predecessorsString}${name}:${locale}`}
                  change={change}
                  name={`${composeFieldNameForForm(
                    name,
                    predecessors,
                  )}[${locale}]`}
                  label={fieldLabel}
                  component={ReduxRichTextField}
                  disabled={
                    formActionType === 'delete' || formActionType === 'recover'
                  }
                  fullWidth
                  fullPagePath={
                    formActionType === 'update' && valid && pristine
                      ? `${absoluteContentEditorPath}/${_id}/${composeFieldNameForForm(
                          name,
                          predecessors,
                        )}/${search}`
                      : null
                  }
                  pictures={currentValues.pictures}
                  rows={1}
                />
              )}
            </div>
          );
        })}
      </div>
    ));
    const tabs = locales.map((locale, i) => (
      <Tab
        id={`${form}:button:tab:${predecessorsString}${locale}`}
        key={locale}
        label={
          mediaType === 'extraSmall'
            ? formatMessage(langMessages[`IN${locale}Briefly`])
            : formatMessage(langMessages[`IN${locale}`])
        }
        style={this.state.styles[i]}
        value={i}
      />
    ));
    return (
      <div>
        <Tabs
          onChange={this.handleTabChange}
          value={this.state.tabIndex}
          style={{ marginTop: '16px' }}
        >
          {tabs}
        </Tabs>
        <SwipeableViews
          index={this.state.tabIndex}
          onChangeIndex={this.handleTabChange}
          style={{ height: 'auto' }}
        >
          {fieldsSet}
        </SwipeableViews>
      </div>
    );
  }
}

I18nFields.propTypes = {
  change: PropTypes.func.isRequired,
  // Этот проп используем composeFields
  clearAsyncError: PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  thingConfig: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
  ).isRequired,
  thingConfigOrSubDocumentAttributes: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
  ).isRequired,
  currentValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  ),
  initialValues: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  ),
  intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  form: PropTypes.string.isRequired,
  mediaType: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  pristine: PropTypes.bool.isRequired,
  predecessors: PropTypes.arrayOf(PropTypes.string).isRequired,
  query: PropTypes.objectOf(PropTypes.string).isRequired,
  valid: PropTypes.bool.isRequired,
};

I18nFields.defaultProps = {
  clearAsyncError: null,
  currentValues: {},
  initialValues: {},
};

I18nFields.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
};

export default I18nFields;
