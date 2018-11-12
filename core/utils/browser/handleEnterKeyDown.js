// функция получает event и обрабочик клика clickHandler
// и, если нажата кнопка Enter,
// выполняет обработчик предав в него ДРУГОЙ СИНТЕЗИРОВАННЫЙ event
// функция используется чтобы вставлять обработчики onKeyDown, рядом с onClick
// так чтобы в onKeyDown был задействован тот же обработчик клика что и в onClick
// если ИСПОЛЬЗОВАТЬ обязательно НАПИСАТЬ тесты !!!
const handleEnterKeyDown = ({ key }, clickHandler) => {
  if (key === 'Enter') {
    // конструируем входящий параметр event ...
    // ... имитируем клик левой кнопкой мышки
    const event = { button: 0 };
    clickHandler(event);
  }
};

export default handleEnterKeyDown;
