import isEmail from 'validator/lib/isEmail';

const validate = values => {
  const errors = {};
  const requiredFields = ['email', 'password', 'password2'];
  requiredFields.forEach(field => {
    if (!values[field]) errors[field] = 'RequiredField';
  });
  if (values.email && !isEmail(values.email)) errors.email = 'InvalidEmail';
  if (values.password !== values.password2) {
    errors.password2 = 'FieldsMustMatch';
  }
  return errors;
};
export default validate;
