const normalizeSlug = value => {
  if (!value) return value;
  return value.replace(/\s/g, '');
};
export default normalizeSlug;
