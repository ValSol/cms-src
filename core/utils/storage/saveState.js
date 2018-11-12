// функция сохраняет данныые в localStorage по ключу itemName

const saveState = (itemName, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(itemName, serializedState);
  } catch (err) {
    // ignore error
  }
};

export default saveState;
