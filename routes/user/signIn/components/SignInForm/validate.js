import isEmail from 'validator/lib/isEmail';

const validate = values => {
  const errors = {};
  const requiredFields = ['email', 'password'];
  requiredFields.forEach(field => {
    if (!values[field]) errors[field] = 'RequiredField';
  });
  if (values.email && !isEmail(values.email)) errors.email = 'InvalidEmail';
  return errors;
};
export default validate;
