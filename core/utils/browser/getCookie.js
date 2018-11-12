// функция возвращает значение кука по заданному имени
// name - имя куки
const getCookie = name => {
  // eslint-disable-next-line function-paren-newline
  const matches = document.cookie.match(
    new RegExp(
      // eslint-disable-next-line no-useless-escape
      `(?:^|; )${name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1')}=([^;]*)`,
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

export default getCookie;
