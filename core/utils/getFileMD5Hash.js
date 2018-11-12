import Promise from 'bluebird';
import SparkMD5 from 'spark-md5';
// функция вычисляет MD5 хеш локального файла (на клиенте)
// по образцу и подобию: https://github.com/satazor/js-spark-md5
// и возвращает промис,
// входные переменные
// file: файл хеш которого вычисляется
// chunkSize: размер сегмента (по умолчанию 2 MB (2097152 байт))
// пример использования: getFileMD5Hash(file).then(hash => console.log(hash))

const getFileMD5Hash = (file, chunkSize = 2097152) =>
  new Promise((resolve, reject) => {
    const blobSlice =
      File.prototype.slice ||
      File.prototype.mozSlice ||
      File.prototype.webkitSlice;
    const chunks = Math.ceil(file.size / chunkSize);
    let currentChunk = 0;
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    const loadNext = () => {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    };

    fileReader.onload = e => {
      spark.append(e.target.result); // Append array buffer
      currentChunk += 1;

      if (currentChunk < chunks) {
        loadNext();
      } else {
        resolve(spark.end());
      }
    };

    fileReader.onerror = err => {
      reject(err);
    };

    loadNext();
  });

export default getFileMD5Hash;
