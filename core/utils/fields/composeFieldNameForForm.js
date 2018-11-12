//  функция формирует имя поля в формате доступным ...
// для "понимания" redux-formatMessage
/*
например,
1) на входе
name = 'slug', predecessors = []
на выходе: 'slug'
2) на входе
name = 'title', predecessors = ['comment','3','title']
на выходе: 'comment[3][title]'
*/
// name - название конкретного поля
// predecessors - массив с нижележайшими названия ключей объекта
const composeFieldNameForForm = (name, predecessors) => {
  if (!predecessors.length) return name;
  const [firstParent, ...rest] = predecessors;
  const processedRest = rest.map(item => `[${item}]`).join('');
  return `${firstParent}${processedRest}[${name}]`;
};

export default composeFieldNameForForm;
