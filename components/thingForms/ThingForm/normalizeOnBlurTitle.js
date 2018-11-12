const normalizeOnBlurTitle = value => {
  if (!value) return value;
  return value
    .split(' ')
    .filter(Boolean)
    .join(' ');
};
export default normalizeOnBlurTitle;
