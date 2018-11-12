import { ObjectID } from 'mongodb';

import { getUserModel } from '../../../../data/mongooseModels';

const users = [
  {
    _id: new ObjectID(),
    email: 'example2@example.com',
    password: '$2a$12$HE3apBdZOEZsrgWUlMQf5u3PVImh2NKuOGm2NUfeEE7xCV/vrjOGu',
    role: 'customer',
  },
  {
    _id: new ObjectID(),
    email: 'admin@example.com',
    password: '$2a$12$HE3apBdZOEZsrgWUlMQf5u3PVImh2NKuOGm2NUfeEE7xCV/vrjOGu',
    role: 'admin',
  },
];

const populateUsers = () =>
  getUserModel().then(User =>
    User.remove({}).then(() => User.insertMany(users)),
  );

export default populateUsers;
