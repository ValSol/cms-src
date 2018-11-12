/* eslint-disable no-underscore-dangle, no-throw-literal */
import React from 'react';

import { getThingConfig, params } from '../../../appConfig';
import { composeDefaultValue, filtersFromQuery } from '../../../core/utils';
import Layout2 from '../../../components/Layout2';
import ThingForm from '../../../components/thingForms/ThingForm';

import composeOnSubmitHandler from './composeOnSubmitHandler';

export default (thingName, context) => {
  const thingConfig = getThingConfig(thingName);
  const { messages, paramFields, sideNavSections } = thingConfig;
  const { client, intl: { messages: allMessages }, query } = context;
  // для корректного перехода от одной подобной формы к другой
  // например от 'ArticleForm:add' к 'ArticleForm:update'
  // обязательно передвать в пропсах: key={form} и form={form}
  const form = `${thingName}Form:add`;

  // определяем значения параметров по умолчанию если они были указаны в query
  const thingParams = paramFields.reduce(
    (prev, { name }) => ({ ...prev, [name]: params[name] }),
    {},
  );
  const paramsFromQuery = filtersFromQuery(query, thingParams);

  // формируем список всех исходных значений
  const initialValues = composeDefaultValue(thingConfig, paramsFromQuery);

  return {
    chunks: ['admin'],
    title: allMessages[messages[`New${thingName}`].id],
    // prop client в компоненту передается для использования в asyncValidate
    component: (
      <Layout2 sideNavSections={sideNavSections} thingName={thingName}>
        <ThingForm
          key={form}
          client={client}
          thingConfig={thingConfig}
          form={form}
          initialValues={initialValues}
          onSubmit={composeOnSubmitHandler(thingConfig)}
        />
      </Layout2>
    ),
  };
};
