/* global browser */
/* eslint-disable class-methods-use-this */

// класс который обеспечивает доступ к различным видам ArticleForm

import Page from '../page';

class ArticleFormPage extends Page {
  constructor(formName) {
    super(formName);
    this.formName = formName;
  }
  // get fields (получаем поля формы)
  get h1() {
    return browser.element('h1');
  }
  get subjectField() {
    return browser.element(`[id='${this.formName}:select:subject']`);
  }
  get sectionField() {
    return browser.element(`[id='${this.formName}:select:section']`);
  }
  get slugField() {
    return browser.element(`[id='${this.formName}:text:slug']`);
  }
  get titleField() {
    const uk = browser.element(`[id='${this.formName}:text:title:uk']`);
    const ru = browser.element(`[id='${this.formName}:text:title:ru']`);
    const en = browser.element(`[id='${this.formName}:text:title:en']`);
    return { uk, ru, en };
  }
  get shortTitleField() {
    const uk = browser.element(`[id='${this.formName}:text:shortTitle:uk']`);
    const ru = browser.element(`[id='${this.formName}:text:shortTitle:ru']`);
    const en = browser.element(`[id='${this.formName}:text:shortTitle:en']`);
    return { uk, ru, en };
  }
  get contentField() {
    const uk = browser.element(`[id='${this.formName}:richText:content:uk']`);
    const ru = browser.element(`[id='${this.formName}:richText:content:ru']`);
    const en = browser.element(`[id='${this.formName}:richText:content:en']`);
    return { uk, ru, en };
  }

  // get field labels (получаем подписи к форма)

  get slugLabel() {
    return browser.element(`label[for='${this.formName}:text:slug']`);
  }
  get titleLabel() {
    const uk = browser.element(`label[for='${this.formName}:text:title:uk']`);
    const ru = browser.element(`label[for='${this.formName}:text:title:ru']`);
    const en = browser.element(`label[for='${this.formName}:text:title:en']`);
    return { uk, ru, en };
  }
  get shortTitleLabel() {
    const uk = browser.element(
      `label[for='${this.formName}:text:shortTitle:uk']`,
    );
    const ru = browser.element(
      `label[for='${this.formName}:text:shortTitle:ru']`,
    );
    const en = browser.element(
      `label[for='${this.formName}:text:shortTitle:en']`,
    );
    return { uk, ru, en };
  }
  get contentLabel() {
    const uk = browser.element(
      `label[for='${this.formName}:richText:content:uk']`,
    );
    const ru = browser.element(
      `label[for='${this.formName}:richText:content:ru']`,
    );
    const en = browser.element(
      `label[for='${this.formName}:richText:content:en']`,
    );
    return { uk, ru, en };
  }

  // get field Error (получаем подписи к форма)

  get slugError() {
    return browser.element(`[id='${this.formName}:text:slug-helper-text']`);
  }
  get titleError() {
    const uk = browser.element(
      `[id='${this.formName}:text:title:uk-helper-text']`,
    );
    const ru = browser.element(
      `[id='${this.formName}:text:title:ru-helper-text']`,
    );
    const en = browser.element(
      `[id='${this.formName}:text:title:en-helper-text']`,
    );
    return { uk, ru, en };
  }
  get shortTitleError() {
    const uk = browser.element(
      `[id='${this.formName}:text:shortTitle:uk-helper-text']`,
    );
    const ru = browser.element(
      `[id='${this.formName}:text:shortTitle:ru-helper-text']`,
    );
    const en = browser.element(
      `[id='${this.formName}:text:shortTitle:en-helper-text']`,
    );
    return { uk, ru, en };
  }
  get contentError() {
    // в draft.js редакторе контента много вложенных div'ов
    // поэтому только 10 содержит сообщение об ошибке
    const uk = browser.element(
      `[id='${this.formName}:richText:content:uk-helper-text']`,
    );
    const ru = browser.element(
      `[id='${this.formName}:richText:content:ru-helper-text']`,
    );
    const en = browser.element(
      `[id='${this.formName}:richText:content:en-helper-text']`,
    );
    return { uk, ru, en };
  }

  // get buttons
  get previewButton() {
    return browser.element('[id="headerTab:Preview"]');
  }
  get editingButton() {
    return browser.element('[id="headerTab:Editing"]');
  }
  get deletingButton() {
    return browser.element('[id="headerTab:Deleting"]');
  }
  get recoveringButton() {
    return browser.element('[id="headerTab:Recovering"]');
  }
  get ukButton() {
    return browser.element(`[id='${this.formName}:button:tab:uk']`);
  }
  get ruButton() {
    return browser.element(`[id='${this.formName}:button:tab:ru']`);
  }
  get enButton() {
    return browser.element(`[id='${this.formName}:button:tab:en']`);
  }
  get submitButton() {
    return browser.element(`[id='${this.formName}:button:submit']`);
  }
  get cancelButton() {
    return browser.element(`[id='${this.formName}:button:cancel']`);
  }

  // methods

  addValue(value, type, name, locale) {
    if (type === 'richText') {
      // richText всегда многоязычный
      this[`${name}Field`][locale].click();
      browser.elementActive().addValue(value);
    } else if (type === 'select') {
      const clickableElement = this[`${name}Field`].$('..').$$('div')[0];
      clickableElement.click();
      browser
        .elementActive()
        // поднимаемся к родительскому элементу на 2 уровня выше
        .$('../..')
        // получаем список элементов для селекта и выбираем элемент № value
        .$$('[role=option]')
        [value].click();
    } else if (locale) {
      this[`${name}Field`][locale].addValue(value);
    } else {
      this[`${name}Field`].addValue(value);
    }
  }

  backspaceValue(count, type, name, locale) {
    const value = '\uE003'.repeat(count);
    if (type === 'richText') {
      // richText всегда многоязычный
      this[`${name}Field`][locale].click();
      browser.elementActive().addValue(value);
    } else if (locale) {
      this[`${name}Field`][locale].addValue(value);
    } else {
      this[`${name}Field`].addValue(value);
    }
  }

  open(slug) {
    if (slug) {
      super.open(`/admin/articles/${slug}`);
    } else {
      super.open('/admin/articles');
    }
  }
}

export default ArticleFormPage;
