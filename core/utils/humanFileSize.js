// размер файла в байтах преобразуется B, KB, MB, TB
// для хорошей читабильности
// результат ОГРАНИЧЕН 999 TB
const humanFileSize = size => {
  if (size <= 0) return '0 B';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / 1024 ** i).toFixed(2) * 1} ${
    ['B', 'kB', 'MB', 'GB', 'TB'][i]
  }`;
};

export default humanFileSize;
