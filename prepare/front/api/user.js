import axios from 'axios';

export function signUpAPI(params) {
  return axios.post('http://localhost:3065/user', params);
}
