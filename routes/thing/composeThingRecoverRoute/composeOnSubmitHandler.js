import { packFields } from '../../../core/utils';
import { add } from '../utils';

const composeOnSubmitHandler = thingConfig => (
  fields,
  dispatch,
  { client },
) => {
  const variables = packFields(fields, thingConfig);
  return add(thingConfig, variables, client, 'FailureOfDataRecovering');
};

export default composeOnSubmitHandler;
