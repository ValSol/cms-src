// вспомогательная функция формирут ключ состояния для элемента массива ...
// ... subDocument'ов чтобы однозначно скрывать / отображать содережимое ...
// ... определенного subDocument'а

const composeShowStateName = (arrayName, id) => `show${arrayName}-${id}`;

export default composeShowStateName;
