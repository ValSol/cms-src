/* eslint-env mocha */
/* global browser */

import { expect } from 'chai';
import jwt from 'jsonwebtoken';

import { auth } from '../../../../../config';
import { getThingModel } from '../../../../../data/mongooseModels';
import { populateArticles } from '../../../data/seed';
import ArticleFormClass from '../ArticleFormClass.page';
import articleFormList from '../articleListForm.page';

const user = {
  email: 'example@example.com',
  _id: '1111111111111',
  role: 'admin',
};
const expiresIn = auth.jwt.expires;
const token = jwt.sign(user, auth.jwt.secret, { expiresIn });

const articleFormDelete = new ArticleFormClass('ArticleForm:delete');
const articleFormRecover = new ArticleFormClass('ArticleForm:recover');

// не стрелочная функция, а нормальное чтобы можно было использовать this.retries(2);
// eslint-disable-next-line func-names
describe('ArticleForm delete item', function() {
  this.retries(2); // итого 3 попытки сделать правильно :)
  let Article;
  let id;
  let title;
  before(() => {
    browser.url('/');
    browser.setCookie({
      name: 'id_token',
      value: token,
    });
    return getThingModel('Article').then(result => {
      Article = result;
    });
  });
  beforeEach(() =>
    Article.findOne().then(({ _id, title: { uk } }) => {
      id = _id;
      title = uk;
    }),
  );
  after(populateArticles);

  it('should should delete article', () => {
    articleFormDelete.open(`delete/${id}`);

    articleFormDelete.submitButton.waitForExist(5000);
    expect(articleFormDelete.submitButton.getAttribute('disabled')).to.equal(
      null,
    );

    articleFormDelete.h1.waitForExist(5000);
    expect(articleFormDelete.h1.getText()).to.equal('Видалення публікації');

    // переходим на общий список статей
    articleFormDelete.cancelButton.click();

    // определяем что имеется в списке имеется публикация и ссылка на ее удаления
    const deleteLink = articleFormList.articleDeleteLink(id);
    deleteLink.waitForExist(5000);

    // переходим обратно на страничку удаления публикацию
    deleteLink.click();
    articleFormDelete.submitButton.waitForExist(5000);
    const url = browser.getUrl();
    expect(url).to.equal(`http://localhost:3000/admin/articles/delete/${id}`);

    // ------
    // проверяем переход на предпросмотр
    articleFormDelete.previewButton.click();
    articleFormDelete.h1.waitForExist(5000);
    expect(articleFormDelete.h1.getText()).to.equal(title);
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormDelete.deletingButton.click();
    articleFormDelete.h1.waitForExist(5000);
    expect(articleFormDelete.h1.getText()).to.equal('Видалення публікації');
    expect(articleFormDelete.submitButton.getText()).to.equal(
      'ВИДАЛИТИ ПУБЛІКАЦІЮ',
    );
    expect(browser.getUrl()).to.equal(url);
    // а теперь кликаем по кноке submit чтобы удалить
    articleFormDelete.submitButton.click();

    // ожидаем отработки сабмита
    // и, следовательно появление кнопки табулции хедера Preview
    articleFormRecover.previewButton.waitForExist(5000);
    expect(articleFormRecover.h1.getText()).to.equal('Публікація видалена!');
  });
});
