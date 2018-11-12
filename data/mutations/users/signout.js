import UserType2 from '../../types/UserType2';

const signout = {
  type: UserType2,
  description: 'Signout the current user',
  async resolve({ request, response }) {
    if (request.user) {
      response.cookie('id_token', '', { maxAge: -1, httpOnly: true });
      return request.user;
    }
    return null;
  },
};

export default signout;
