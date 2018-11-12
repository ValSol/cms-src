const composeTypeName = (input, consideringRequired) => {
  if (input && consideringRequired) {
    return ['Input Type', 'InputType'];
  }
  if (input && !consideringRequired) {
    return [
      'Not Considering Required Input Type',
      'NotConsideringRequiredInputType',
    ];
  }
  if (!input && consideringRequired) {
    return ['Type', 'Type'];
  }
  // и оставшийся вариант для (!input && !consideringRequired)
  return ['Not Considering Required Type', 'NotConsideringRequiredType'];
};

// экспортируем функцию которая берет тип из кеша или вычисялет его
export default composeTypeName;
