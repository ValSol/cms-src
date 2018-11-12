export const admin = 'admin';
export const customer = 'customer';
export const guest = 'guest';

export const allRoles = [admin, customer, guest];

const roles = {
  [guest]: {
    can: ['Article:get'],
  },
  [customer]: {
    can: [
      'order:add',
      {
        name: 'order:get',
        when({ user, order }) {
          // eslint-disable-next-line no-underscore-dangle
          return user._id === order.ownerId;
        },
      },
    ],
    inherits: ['guest'],
  },
  [admin]: {
    can: ['*'],
  },
};

export default roles;
