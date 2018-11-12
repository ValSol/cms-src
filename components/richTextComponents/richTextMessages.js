import { defineMessages } from 'react-intl';
/* Используются в:
1) RichTextFieldChild компоненте
2) LinkAddressPopover компоненте
3) PicturesSelectDialog компоненте
4) RichTextEditorToolbar компоненте
5) RichTextEditorToolbar2 компоненте
*/

export default defineMessages({
  Bold: {
    id: 'RichText.Bold',
    defaultMessage: 'Жирный',
  },
  Italic: {
    id: 'RichText.Italic',
    defaultMessage: 'Курсив',
  },
  Underlined: {
    id: 'RichText.Underlined',
    defaultMessage: 'Подчеркнутый',
  },
  Collapse: {
    id: 'RichText.Collapse',
    defaultMessage: 'Свернуть',
  },
  linkAddress: {
    id: 'RichText.linkAddress',
    defaultMessage: 'адрес ссылки',
  },
  Link: {
    id: 'RichText.Link',
    defaultMessage: 'Ccылка',
  },
  Picture: {
    id: 'RichText.Picture',
    defaultMessage: 'Картинка',
  },
  PicturesSelection: {
    id: 'RichText.PicturesSelection',
    defaultMessage: 'Выбор картинок',
  },
  OrderedList: {
    id: 'RichText.OrderedList',
    defaultMessage: 'Нумерованный список',
  },
  UnorderedList: {
    id: 'RichText.UnorderedList',
    defaultMessage: 'Список',
  },
  Caption: {
    id: 'RichText.Caption',
    defaultMessage: 'Подпись',
  },
  ExpandToFullPage: {
    id: 'RichText.ExpandToFullPage',
    defaultMessage: 'Развернуть на всю страницу',
  },
});
