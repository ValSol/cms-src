import { GraphQLString, GraphQLID } from 'graphql/type';

import UserType2 from '../../types/UserType2';

import { getUserModel } from '../../mongooseModels';

const user = {
  type: UserType2,
  description: 'User selected by email or id',
  args: {
    _id: {
      name: 'articleID',
      type: GraphQLID,
    },
    email: {
      name: 'articleSlug',
      type: GraphQLString,
    },
  },
  async resolve(root, { _id, email }) {
    const User = await getUserModel();
    if (_id) return User.findById(_id);

    return User.findOne({ email });
  },
};

export default user;
