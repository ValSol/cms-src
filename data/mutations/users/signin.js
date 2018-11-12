import { GraphQLString, GraphQLNonNull } from 'graphql/type';

import UserType2 from '../../types/UserType2';

import { getUserModel } from '../../mongooseModels';
import { setAuthStuff } from './utils';

const signin = {
  type: UserType2,
  description: 'Sign In by email and password',
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parentValue, { email, password }) {
    const User = await getUserModel();
    const existingUser = await User.findOne({ email }).exec();
    if (!existingUser || !await existingUser.passwordIsValid(password)) {
      return null;
    }

    return setAuthStuff(existingUser, parentValue);
  },
};

export default signin;
