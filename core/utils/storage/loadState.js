// функция выгружает данныые из localStorage по ключу itemName

const loadState = itemName => {
  try {
    const serializedState = localStorage.getItem(itemName);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export default loadState;
