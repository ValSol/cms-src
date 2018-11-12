import { defineMessages } from 'react-intl';
/* Используются в:
1) ReduxPicturesSelectField компоненте
2) ReduxRichTextField компоненте
3) ReduxSelectField компоненте
4) ReduxTextField компоненте
5) ReduxTextField компоненте
6) ThingFormOrderingList компоненте
7) ThingsImport компоненте роута thingsImport
*/

export default defineMessages({
  DataProcessingFailure: {
    id: 'Validation.DataProcessingFailure',
    defaultMessage: 'Data processing failure',
  },
  InternetConnectionError: {
    id: 'Validation.InternetConnectionError',
    defaultMessage: 'Internet connection error',
  },
  RequiredField: {
    id: 'Validation.RequiredField',
    defaultMessage: 'Required field',
  },
  InvalidEmail: {
    id: 'Validation.InvalidEmail',
    defaultMessage: 'Invalid email',
  },
  EmailAlreadyTaken: {
    id: 'Validation.EmailAlreadyTaken',
    defaultMessage: 'Email already taken',
  },
  FieldsMustMatch: {
    id: 'Validation.FieldsMustMatch',
    defaultMessage: 'Fields must match',
  },
  InvalidCharacters: {
    id: 'Validation.InvalidCharacters',
    defaultMessage: 'Invalid characters',
  },
  slugAlreadyTaken: {
    id: 'Validation.slugAlreadyTaken',
    defaultMessage: 'Slug already taken',
  },
  slugAsEmptyFieldAlreadyTaken: {
    id: 'Validation.slugAsEmptyFieldAlreadyTaken',
    defaultMessage: 'Empty slug already taken',
  },
  InvalidDataFormat: {
    id: 'Validation.InvalidDataFormat',
    defaultMessage: 'Invalid data format',
  },
  InvalidI18nField: {
    id: 'Validation.InvalidI18nField',
    defaultMessage: 'Invalid i18n field',
  },
  InvalidParamField: {
    id: 'Validation.InvalidParamField',
    defaultMessage: 'Invalid param field',
  },
  InvalidBooleanField: {
    id: 'Validation.InvalidBooleanField',
    defaultMessage: 'Invalid boolean field',
  },
  InvalidTextField: {
    id: 'Validation.InvalidTextField',
    defaultMessage: 'Invalid text field',
  },
  InvalidNumberField: {
    id: 'Validation.InvalidNumberField',
    defaultMessage: 'Invalid number field',
  },
  FailureOfDataAdding: {
    id: 'Validation.FailureOfDataAdding',
    defaultMessage: 'Failure of data adding',
  },
  FailureOfDataDeleting: {
    id: 'Validation.FailureOfDataDeleting',
    defaultMessage: 'Failure of data deleting',
  },
  FailureOfDataRecovering: {
    id: 'Validation.FailureOfDataRecovering',
    defaultMessage: 'Failure of data recovering',
  },
  FailureOfDataUpdating: {
    id: 'Validation.FailureOfDataUpdating',
    defaultMessage: 'Failure of data updating',
  },
});
