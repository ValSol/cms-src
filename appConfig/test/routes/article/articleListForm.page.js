/* global browser */
/* eslint-disable class-methods-use-this */

import Page from '../page';

class ArticleFormList extends Page {
  // get fields (получаем поля формы)
  get h1() {
    return browser.element('h1');
  }
  articleDeleteLink(id) {
    // возвращает
    return browser
      .element('[id="ArticleListForm:List"]')
      .$(`[href='/admin/articles/delete/${id}']`);
  }
  articleLink(id) {
    // возвращает
    return browser
      .element('[id="ArticleListForm:List"]')
      .$(`[href='/admin/articles/${id}']`);
  }

  get addButton() {
    return browser.element('[id="ArticleListForm:button:add"]');
  }

  open() {
    super.open('/admin/articles');
  }
}

export default new ArticleFormList();
