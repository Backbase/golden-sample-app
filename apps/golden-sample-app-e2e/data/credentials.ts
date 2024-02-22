import { User } from './data-types/user';

export const defaultUser: User = {
  username: '<USER_NAME>',
  password: '<PASSWORD>',
};

export const wrongUser: User = {
  username: 'someone',
  password: 'some_password',
};
