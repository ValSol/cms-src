import Promise from 'bluebird';
// ВНИМАНИЕ! почему-то без bluebird ECЛИ использовать нативный Promise
// возникает ОШИБКА!

import getFileMD5Hash from './getFileMD5Hash';
import replaceNewFilesWithOldMd5Hash from './replaceNewFilesWithOldMd5Hash';

// функция 1) вычисляет md5Hashes для всех новых файлов (newFiles)
// 2) если среди картинок уже имеются какие-то загружаемые файлы, то эти
// файлы заменяются уже сохраненными картинками
// возвращает промис который ресолвится со списком ДВУХ массивов
// 1-й массив: новых картинок возможно частично или полностью замененных,
// сстарыми с тем же md5Hash
// 2-й массив: старых картинок возможно за вычитом тех который пошли
// на замену новых картинок

const getNewFilesMd5HashAndReplaceDuplicateFiles = (pictures, newFiles) =>
  Promise.map(newFiles, file => getFileMD5Hash(file)).then(md5Hashes => {
    const files = newFiles.map((file, i) => {
      const src = window.URL.createObjectURL(file);
      const { name, size } = file;
      const md5Hash = md5Hashes[i];
      return {
        engaged: [],
        caption: { uk: name, ru: name, en: name },
        file,
        initialName: name,
        md5Hash,
        size,
        src,
      };
    });
    // ВНИМАНИЕ updatePictures возвращаются в види массива ДВУХ массивов
    // [newPictures, oldPictures], т.к. newPictures понадобятся для ...
    // отдельной отработки при перятигивании картинок прямо в тело richText контента
    const updatedPictures = replaceNewFilesWithOldMd5Hash(files, pictures);
    return Promise.resolve(updatedPictures);
  });

export default getNewFilesMd5HashAndReplaceDuplicateFiles;
