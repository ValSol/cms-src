import React from 'react';

import { locales } from '../../../appConfig';
import Layout2 from '../../../components/Layout2';
import ArticlePreview from '../../Things/components/ArticlePreview';

import composeHeaderTabs from './composeHeaderTabs';
import query from './article.graphql';
import queryPopulatedExcerpts from './excerptsPopulatedWithArticlesWithShortTitle.graphql';

export default {
  path: '/:slug?',

  async action(context) {
    const {
      client,
      locale,
      params: { slug, subject, section },
      ping,
    } = context;

    if (!(subject && section)) return null;

    const variables = {
      subject,
      section,
      slug: slug || '',
    };
    locales.reduce((prev, lang) => {
      // eslint-disable-next-line no-param-reassign
      prev[lang] = lang === locale;
      return prev;
    }, variables);

    const queryResult = await client.query({
      query,
      variables,
    });

    // если данные для указанного слага не найдены
    // завершаем обработку роута
    if (!queryResult.data || !queryResult.data.article) return null;
    const { data: { article } } = queryResult;

    // если ping === true просто возвращаем _id и thingName
    if (ping) {
      // eslint-disable-next-line no-underscore-dangle
      const { _id } = article;
      return { _id, thingName: 'Article' };
    }

    // запрашиваем данные для построения headerTabs
    // данные запрашиваем отдельным запросом, а не совместно с предыдущим
    // чтобы этот запрос закешировался
    const variables2 = locales.reduce((prev, lang) => {
      // eslint-disable-next-line no-param-reassign
      prev[lang] = lang === locale;
      return prev;
    }, {});
    const queryPopulatedExcerptsResult = await client.query({
      query: queryPopulatedExcerpts,
      variables: variables2,
    });

    // если данные для построения headerTabs не получены
    // завершаем обработку роута
    if (
      !queryPopulatedExcerptsResult.data ||
      !queryPopulatedExcerptsResult.data.populatedExcerpts
    ) {
      return null;
    }

    const { data: { populatedExcerpts } } = queryPopulatedExcerptsResult;

    // eslint-disable-next-line no-underscore-dangle
    const title = article.title[locale];
    const sideNavSections = ['ContentSideNavSection', 'Article'];
    const headerTabs = composeHeaderTabs(populatedExcerpts, context);
    return {
      title,
      component: (
        <Layout2
          headerTabs={headerTabs}
          sideNavSections={sideNavSections}
          thingName="Article"
        >
          <ArticlePreview lang={locale} thing={article} />
        </Layout2>
      ),
    };
  },
};
