import AppUser from '@/interface/AppUser';
import {getItem, removeItem, setItem} from '@/method/localStorage-methods';
import moment from 'moment';

function getCurrentUser(): AppUser | null {
  return getItem('user');
}

function userIsLoggedIn(): boolean {
  return getCurrentUser() !== null && moment().isBefore(moment(getCurrentUser()!.logDate).add(1, 'day'));
}

function logOutUser() {
  removeItem('user');
}

function logInUser(user: AppUser) {
  user.logDate = moment().toISOString();
  setItem('user', user);
}

export {userIsLoggedIn, getCurrentUser, logOutUser, logInUser};
