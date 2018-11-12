// определяем что НЕ была нажата ни одн служебная клавиша

const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

export default isModifiedEvent;
