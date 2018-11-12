// -----------------------------------------
// функция возвращает строку в которой первая буква - в верхнем регистре
// s - передаваемая строка
const capitalizeFirstLetter = s => s.charAt(0).toUpperCase() + s.slice(1);

export default capitalizeFirstLetter;
