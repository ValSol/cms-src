// функция оеределяет используются ли richText поля где либо ...
// ... по всему дереву вложенных документов

const hasRichTextFields = thingConfig => {
  const { richTextFields, subDocumentFields } = thingConfig;
  if (richTextFields && richTextFields.length) return true;
  if (subDocumentFields && subDocumentFields.length) {
    return subDocumentFields.some(({ attributes }) =>
      hasRichTextFields(attributes),
    );
  }
  return false;
};

export default hasRichTextFields;
