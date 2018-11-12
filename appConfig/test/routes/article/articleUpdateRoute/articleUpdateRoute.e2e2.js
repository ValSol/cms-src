/* eslint-env mocha */
/* global browser */

import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import rimraf from 'rimraf';

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

const articleFormUpdate = new ArticleFormClass('ArticleForm:update');

// не стрелочная функция, а нормальное чтобы можно было использовать this.retries(2);
// eslint-disable-next-line func-names
describe('ArticleForm update item', function() {
  this.retries(2); // итого 3 попытки сделать правильно :)
  const titleDelta = ' test +';
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

  it('should should update article without image', () => {
    articleFormUpdate.open(`${id}`);

    articleFormUpdate.submitButton.waitForExist(5000);
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');

    // переходим на общий список статей
    articleFormUpdate.cancelButton.click();

    // определяем что имеется в списке имеется публикация и ссылка на нее
    // содержащая текст соответствующий title
    const link = articleFormList.articleLink(id);
    link.waitForExist(5000);
    expect(link.getText()).to.equal(title);

    // переходим обратно на страничку удаления публикацию
    link.click();
    articleFormUpdate.submitButton.waitForExist(5000);
    const url = browser.getUrl();
    expect(url).to.equal(`http://localhost:3000/admin/articles/${id}`);

    // ------
    // проверяем переход на предпросмотр
    articleFormUpdate.previewButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal(title);
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormUpdate.editingButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(browser.getUrl()).to.equal(url);

    // вносим изменения в поле title на закладке uk

    const type = 'text';
    const name = 'title';
    const locale = 'uk';
    articleFormUpdate.addValue(titleDelta, type, name, locale);
    browser.pause(250);

    // после изменения поля submitButton становится доступной
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      null,
    );

    // сохраняем отредактированную публикацию
    articleFormUpdate.submitButton.click();
    browser.pause(250);

    // кнопка submit опять не доступна
    articleFormUpdate.submitButton.waitForExist(5000);
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );
    // и в поле title.uk теперь новое значение title
    expect(articleFormUpdate.titleField.uk.getValue()).to.equal(
      `${title}${titleDelta}`,
    );

    // переходим на общий список статей
    articleFormUpdate.cancelButton.click();

    // определяем что имеется в списке имеется публикация и ссылка на нее
    // содержащая текст соответствующий новому значению title
    const link2 = articleFormList.articleLink(id);
    link2.waitForExist(5000);
    expect(link2.getText()).to.equal(`${title}${titleDelta}`);

    // переходим обратно на страничку удаления публикацию
    link2.click();
    articleFormUpdate.submitButton.waitForExist(5000);
    expect(url).to.equal(`http://localhost:3000/admin/articles/${id}`);

    // ------
    // проверяем переход на предпросмотр
    articleFormUpdate.previewButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal(`${title}${titleDelta}`);
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormUpdate.editingButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(browser.getUrl()).to.equal(url);
  });
  it('should should update article with image', () => {
    articleFormUpdate.open(`${id}`);

    articleFormUpdate.submitButton.waitForExist(5000);
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');

    // переходим на общий список статей
    articleFormUpdate.cancelButton.click();

    // определяем что имеется в списке имеется публикация и ссылка на нее
    // содержащая текст соответствующий title
    const link = articleFormList.articleLink(id);
    link.waitForExist(5000);
    expect(link.getText()).to.equal(title);

    // переходим обратно на страничку удаления публикацию
    link.click();
    articleFormUpdate.submitButton.waitForExist(5000);
    const url = browser.getUrl();
    expect(url).to.equal(`http://localhost:3000/admin/articles/${id}`);

    // ------
    // проверяем переход на предпросмотр
    articleFormUpdate.previewButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal(title);
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormUpdate.editingButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(browser.getUrl()).to.equal(url);

    // пока-что ничего не изменяли так что кнопка submit до сих пор не доступна
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    // добавляем файл с картинкой
    const toUpload = 'test\\Coala.jpg';
    browser.chooseFile('[id="ArticleForm:update:pictures"', toUpload);
    browser.pause(1000);

    // теперь кнопка submit доступна
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      null,
    );

    // сохраняем отредактированную публикацию
    articleFormUpdate.submitButton.click();
    browser.pause(1000);

    // кнопка submit опять не доступна
    articleFormUpdate.submitButton.waitForExist(5000);
    expect(articleFormUpdate.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    // проверяем что после сабмита появилась картинка с src соответствующим
    // загруженному файлу: 'C:\Users\Public\Pictures\Sample Pictures\Coala.jpg'
    // с адресом определенным адресом src и alt
    // в списке всех публикаций
    const expectedSrc = `http://localhost:3000/uploads/article/${id}/83a5ed7ecdc623dabdc7941c2b8212e6.jpg`;
    const src = browser.element('img[alt="Coala.jpg"]').getAttribute('src');
    expect(src).to.equal(expectedSrc);

    // переходим на общий список статей
    articleFormUpdate.cancelButton.click();

    // определяем что имеется в списке имеется публикация и ссылка на нее
    // содержащая текст соответствующий новому значению title
    const link2 = articleFormList.articleLink(id);
    link2.waitForExist(5000);
    expect(link2.getText()).to.equal(title);

    // переходим обратно на страничку удаления публикацию
    link2.click();
    articleFormUpdate.submitButton.waitForExist(5000);
    expect(url).to.equal(`http://localhost:3000/admin/articles/${id}`);
    // проверяем что картинка продолжает присутствовать на странице
    const src2 = browser.element('img[alt="Coala.jpg"]').getAttribute('src');
    expect(src2).to.equal(expectedSrc);

    // ------
    // проверяем переход на предпросмотр
    articleFormUpdate.previewButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal(title);
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormUpdate.editingButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(browser.getUrl()).to.equal(url);
    // проверяем что картинка продолжает присутствовать на странице
    const src3 = browser.element('img[alt="Coala.jpg"]').getAttribute('src');
    expect(src3).to.equal(expectedSrc);
    // удаляем созданную в процессе тестирования картинку из соответствующей папки
    // предполагаем что папки с названием "src" ниже по иерархии ...
    // ... чем папка проекта быть НЕ может
    const [rootPath] = __dirname.split('\\src\\');
    rimraf(`${rootPath}\\public\\uploads\\article\\${id}`, () => {});
  });
});
