import axios from 'axios';

export function logInAPI(params) {
  return axios.post('/user/login', params);
}

export function logOutAPI() {
  console.log('api logout');
  return axios.post('/user/logout');
}

export function loadMyInfoAPI() {
  return axios.get('/user');
}

export function signUpAPI(params) {
  return axios.post('/user', params);
}

export function changeNicknameAPI(params) {
  return axios.patch('/user/nickname', { nickname: params });
}

export function followAPI(params) {
  return axios.patch(`/user/${params}/follow`);
}

export function unfollowAPI(params) {
  return axios.delete(`/user/${params}/follow`);
}

export function loadFollowersAPI() {
  return axios.get('/user/followers');
}

export function loadFollowingsAPI() {
  return axios.get('/user/followings');
}

export function removeFollowerAPI(params) {
  return axios.delete(`/user/follower/${params}`);
}
