import { GraphQLString, GraphQLNonNull } from 'graphql/type';

import UserType2 from '../../types/UserType2';
import { getUserModel } from '../../mongooseModels';
import { setAuthStuff } from './utils';

import {
  admin as adminRole,
  customer as customerRole,
} from '../../../core/rbac/roles';

const singup = {
  type: UserType2,
  description: 'Sign Up by email and password',
  args: {
    email: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) },
  },
  async resolve(parentValue, { email, password }) {
    const User = await getUserModel();
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return null;
      // res.status(409).send(`The specified email ${email} address already exists.`);
    }
    const role = email === 'v.solovyov@intellect.ua' ? adminRole : customerRole;
    const newUser = new User({ email, password, role });
    await newUser.save();

    return setAuthStuff(newUser, parentValue);
  },
};

export default singup;
