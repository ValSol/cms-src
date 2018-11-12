/* eslint-env mocha */
/* global browser */

import { expect } from 'chai';
import jwt from 'jsonwebtoken';
import rimraf from 'rimraf';

import { auth } from '../../../../../config';
import { getBreadcrumbs } from '../../../../../core/utils';
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

const articleFormAdd = new ArticleFormClass('ArticleForm:add');
const articleFormUpdate = new ArticleFormClass('ArticleForm:update');

// не стрелочная функция, а нормальное чтобы можно было использовать this.retries(2);
// eslint-disable-next-line func-names
describe('ArticleForm new item', function() {
  this.retries(2); // итого 3 попытки сделать правильно :)
  before(() => {
    browser.url('/');
    browser.setCookie({
      name: 'id_token',
      value: token,
    });
  });
  after(populateArticles);

  const activateField = (name, locale) => {
    const { value: inactiveColor } = locale
      ? articleFormAdd[`${name}Label`][locale].getCssProperty('color')
      : articleFormAdd[`${name}Label`].getCssProperty('color');
    // проверяем лейбл не актививный
    expect(inactiveColor).to.equal('rgba(0,0,0,0.54)');
    if (locale) {
      articleFormAdd[`${name}Field`][locale].click();
    } else {
      articleFormAdd[`${name}Field`].click();
    }
    browser.pause(8);
    const { value: activeColor } = locale
      ? articleFormAdd[`${name}Label`][locale].getCssProperty('color')
      : articleFormAdd[`${name}Label`].getCssProperty('color');
    // проверяем что лейбл активизируется
    expect(activeColor).to.not.equal('rgba(0,0,0,0.54)');
    // но не краснеет :-)
    expect(activeColor).to.not.equal('rgba(0,188,212,1)');
  };

  const fillInField = (type, name, locale) => {
    // helper который возвращает текующую ошибку различным образом
    // в зависимости от присутствия locale
    const error = () =>
      locale
        ? articleFormAdd[`${name}Error`][locale]
        : articleFormAdd[`${name}Error`];
    // в исходном состоянии отсутствует сообщение об ошибке
    expect(error()).to.equal(undefined);
    const str = locale ? `${name}:${locale}` : name;
    articleFormAdd.addValue(str, type, name, locale);
    articleFormAdd.backspaceValue(str.length, type, name, locale);
    browser.pause(250);
    // обнаруживаем ошибку
    const { value: errorMessageColor } = error().getCssProperty('color');
    expect(errorMessageColor).to.equal('rgba(244,67,54,1)');
    expect(error().getText()).to.equal("Обов'язкове поле");
    // опять заполняем поле
    articleFormAdd.addValue(str, type, name, locale);
    browser.pause(250);
    // ошибки уже нет
    expect(error()).to.equal(undefined);
  };

  it('should go around the empty fields without errors', () => {
    articleFormAdd.open('new');

    activateField('slug');

    activateField('title', 'uk');
    activateField('shortTitle', 'uk');
    activateField('content', 'uk');

    articleFormAdd.ruButton.click();
    browser.pause(250);
    activateField('title', 'ru');
    activateField('shortTitle', 'ru');
    activateField('content', 'ru');

    articleFormAdd.enButton.click();
    browser.pause(250);
    activateField('title', 'en');
    activateField('shortTitle', 'en');
    activateField('content', 'en');
  });

  it('should generate error', () => {
    articleFormAdd.open('new');

    expect(articleFormAdd.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    // геренируем ошибку если выбрали Пром.зразки и Информация
    articleFormAdd.addValue(3, 'select', 'subject');
    browser.pause(500);
    // закрываем выпадающий список клавишей Esc, так как click по h1 и ...
    // ... прочие клики в сторону не срабатывали
    browser.keys(['\uE00C']);
    browser.pause(500);

    articleFormAdd.addValue(0, 'select', 'section');
    browser.pause(500);

    articleFormAdd.slugField.click();
    articleFormAdd.h1.click(); // аинхронная проверка оnBlur поэтому кликаем в сторону
    browser.pause(500);
    expect(articleFormAdd.slugError.getText()).to.equal(
      'Порожня стрічка-ідентифікатор вже використовується',
    );

    // нет ошибок если выбрали Пром.зразки и Сервіси
    articleFormAdd.addValue(1, 'select', 'section');
    browser.pause(500); // за меньшее время не успевает меню исчезнуть

    articleFormAdd.h1.click(); // аcинхронная проверка оnBlur поэтому кликаем в сторону
    browser.pause(500);
    // убеждаемся что сообщения об ошибке нет
    expect(articleFormAdd.slugError.value).to.equal(null);

    // геренируем ошибку если выбрали Винаходи и Информация
    articleFormAdd.addValue(2, 'select', 'subject');
    browser.pause(500);
    browser.keys(['\uE00C']);
    browser.pause(500);

    articleFormAdd.h1.click(); // асинхронная проверка оnBlur поэтому кликаем в сторону

    expect(articleFormAdd.slugError.getText()).to.equal(
      'Порожня стрічка-ідентифікатор вже використовується',
    );

    // нет ошибок если слаг уникальный
    articleFormAdd.slugField.addValue('aaa');
    browser.pause(500);
    // убеждаемся что сообщения об ошибке нет
    expect(articleFormAdd.slugError.value).to.equal(null);

    // нет ошибок если слаг остается уникальным
    articleFormAdd.addValue(0, 'select', 'section');
    browser.pause(5000);
    expect(articleFormAdd.slugError.value).to.equal(null);

    // геренируем ошибку если не уникальный слаг
    articleFormAdd.slugField.addValue('\uE003\uE003\uE003'); // удаляем бекспейсом
    articleFormAdd.slugField.addValue('abc');
    browser.pause(500);

    articleFormAdd.h1.click(); // аинхронная проверка оnBlur поэтому кликаем в сторону
    browser.pause(500); // за меньшее время не успевает меню исчезнуть
    expect(articleFormAdd.slugError.getText()).to.equal(
      'Стрічка-ідентифікатор вже використовується',
    );
  });

  it('should fill in all fields without pictures and create article', () => {
    articleFormAdd.open('new');
    // должен появится alert - запрашивающий разрешение на то чтобы перегрузиить страницу
    browser.pause(500);
    browser.alertAccept(); // подтверждаем перегрузку на новую страницу

    expect(articleFormAdd.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    articleFormAdd.addValue(3, 'select', 'subject');
    browser.pause(500);
    // закрываем выпадающий список клавишей Esc, так как click по h1 и ...
    // ... прочие клики в сторону не срабатывали
    browser.keys(['\uE00C']);
    browser.pause(500);

    articleFormAdd.addValue(0, 'select', 'section');
    browser.pause(5000); // за меньшее время не успевает меню исчезнуть

    fillInField('text', 'title', 'uk');
    fillInField('text', 'shortTitle', 'uk');
    fillInField('richText', 'content', 'uk');

    articleFormAdd.ruButton.click();
    browser.pause(250);
    fillInField('text', 'title', 'ru');
    fillInField('text', 'shortTitle', 'ru');
    fillInField('richText', 'content', 'ru');

    articleFormAdd.enButton.click();
    browser.pause(250);
    fillInField('text', 'title', 'en');
    fillInField('text', 'shortTitle', 'en');
    fillInField('richText', 'content', 'en');

    browser.pause(250);
    expect(articleFormAdd.h1.getText()).to.equal('Нова публікація');
    expect(articleFormAdd.submitButton.getText()).to.equal('ДОДАТИ ПУБЛІКАЦІЮ');
    expect(articleFormAdd.submitButton.getAttribute('disabled')).to.equal(null);

    // а теперь кликаем по кноке submit
    articleFormAdd.submitButton.click();
    browser.pause(500); // ожидаем отработки сабмита
    expect(articleFormAdd.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );
    expect(articleFormAdd.slugError.getText()).to.equal(
      'Порожня стрічка-ідентифікатор вже використовується',
    );

    // исправляем slug
    articleFormAdd.slugField.addValue('slug');
    browser.pause(500);
    // ожидаем отработки сабмита
    articleFormAdd.submitButton.click();
    // ожидаем отработки сабмита
    // и, следовательно появление кнопки табулции хедера Preview
    articleFormUpdate.previewButton.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(articleFormUpdate.submitButton.getText()).to.equal('ЗБЕРЕГТИ ЗМІНИ');
    const url = browser.getUrl();
    // ------
    // проверяем переход на предпросмотр
    articleFormUpdate.previewButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('title:uk');
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormUpdate.editingButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(browser.getUrl()).to.equal(url);
    // ----
    // проверяем что после сабмита появилась ссылка на вновь созданную публикацию
    // в списке всех публикаций
    const chain = getBreadcrumbs(url);
    const id = chain[chain.length - 1]; // id созданной публикации

    articleFormUpdate.cancelButton.waitForExist(5000);
    articleFormUpdate.cancelButton.click();

    articleFormList.addButton.waitForExist(5000);

    const deleteLink = articleFormList.articleDeleteLink(id);
    deleteLink.waitForExist(5000);

    const link = articleFormList.articleLink(id);
    link.waitForExist(5000);
  });
  it('should fill in all fields with pictures and create article', () => {
    articleFormAdd.open('new');

    expect(articleFormAdd.submitButton.getAttribute('disabled')).to.equal(
      'true',
    );

    articleFormAdd.addValue(1, 'select', 'subject');
    browser.pause(500);
    // закрываем выпадающий список клавишей Esc, так как click по h1 и ...
    // ... прочие клики в сторону не срабатывали
    browser.keys(['\uE00C']);
    browser.pause(500);

    articleFormAdd.addValue(0, 'select', 'section');
    browser.pause(5000); // за меньшее время не успевает меню исчезнуть

    fillInField('text', 'title', 'uk');
    fillInField('text', 'shortTitle', 'uk');
    fillInField('richText', 'content', 'uk');

    articleFormAdd.ruButton.click();
    browser.pause(250);
    fillInField('text', 'title', 'ru');
    fillInField('text', 'shortTitle', 'ru');
    fillInField('richText', 'content', 'ru');

    articleFormAdd.enButton.click();
    browser.pause(250);
    fillInField('text', 'title', 'en');
    fillInField('text', 'shortTitle', 'en');
    fillInField('richText', 'content', 'en');

    browser.pause(250);
    expect(articleFormAdd.submitButton.getAttribute('disabled')).to.equal(null);

    const toUpload = 'test\\Coala.jpg';
    browser.chooseFile('[id="ArticleForm:add:pictures"', toUpload);
    browser.pause(500);

    // а теперь кликаем по кноке submit
    articleFormAdd.submitButton.click();
    // ожидаем отработки сабмита
    // и, следовательно появление кнопки табулции хедера Preview
    articleFormUpdate.previewButton.waitForExist(30000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    const url = browser.getUrl();
    // ------
    // проверяем переход на предпросмотр
    articleFormUpdate.previewButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('title:uk');
    // ----
    // возвращаемся назад, на страницу редактирования
    articleFormUpdate.editingButton.click();
    articleFormUpdate.h1.waitForExist(5000);
    expect(articleFormUpdate.h1.getText()).to.equal('Редагування публікації');
    expect(browser.getUrl()).to.equal(url);
    // ----
    // получаем id вновь созданной публикации
    const chain = getBreadcrumbs(url);
    const id = chain[chain.length - 1]; // id созданной публикации

    // проверяем что после сабмита появилась картинка с src соответствующим
    // загруженному файлу: 'C:\Users\Public\Pictures\Sample Pictures\Coala.jpg'
    // с адресом определенным адресом src и alt
    // в списке всех публикаций
    const expectedSrc = `http://localhost:3000/uploads/article/${id}/83a5ed7ecdc623dabdc7941c2b8212e6.jpg`;
    const src = browser.element('img[alt="Coala.jpg"]').getAttribute('src');
    expect(src).to.equal(expectedSrc);

    // проверяем что после сабмита появилась ссылка на вновь созданную публикацию
    // в списке всех публикаций
    articleFormUpdate.cancelButton.waitForExist(5000);
    articleFormUpdate.cancelButton.click();

    articleFormList.addButton.waitForExist(5000);

    const deleteLink = articleFormList.articleDeleteLink(id);
    deleteLink.waitForExist(5000);

    const link = articleFormList.articleLink(id);
    link.waitForExist(5000);
    // удаляем созданную в процессе тестирования картинку из соответствующей папки
    // предполагаем что папки с названием "src" ниже по иерархии ...
    // ... чем папка проекта быть НЕ может
    const [rootPath] = __dirname.split('\\src\\');
    rimraf(`${rootPath}\\public\\uploads\\article\\${id}`, () => {});
  });
});
