import { defineMessages } from 'react-intl';
/* Используются в:
1) PicturesSelect компоненте
2) PictureForm компоненте
3) FilesUploadDialog компоненте
а также через контекст роута используются в
*/

export default defineMessages({
  LoadMorePictures: {
    id: 'PicturesSelect.LoadMorePictures',
    defaultMessage: 'Загрузить еще картинки',
  },
  RemovePicture: {
    id: 'PicturesSelect.RemovePicture',
    defaultMessage: 'Удалить картинку',
  },
  RemovingPicture: {
    id: 'PicturesSelect.RemovingPicture',
    defaultMessage: 'Удаляем картинку!',
  },
  EditingPictureCaptions: {
    id: 'PicturesSelect.EditingPictureCaptions',
    defaultMessage: 'Редактируем подписи к картинке',
  },
  LoadingImageFiles: {
    id: 'PicturesSelect.LoadingImageFiles',
    defaultMessage: 'Загружаются файлы картинок',
  },
  LoadingImageFilesError: {
    id: 'PicturesSelect.LoadingImageFilesError',
    defaultMessage: 'Ошибка загрузки файлов картинок!',
  },
});
