import { all, call, fork, put, take } from 'redux-saga/effects';
import axios from 'axios';

/**
generator 함수는 function* 로 선언한다.
yield 는 return 과 비슷한 역할을 하지만, 함수를 종료시키지는 않는다.
next() 를 사용하여 yield 를 호출하면 다음 yield 까지 코드를 실행한다.
ex) yield 1; yield 2; yield 3; 이라면 next() 를 세 번 호출해야 한다.
yield 를 사용하여 값을 반환할 수 있다. 
*/

/**
 * fork 는 함수(비동기)를 실행한다.
 * call 은 동기 함수를 실행한다.
 * put 은 액션을 dispatch 한다.
 * tkae 는 액션이 dispatch 되면 제너레이터를 next 한다. 근데 일회용임.
 * takeEvery 는 액션이 dispatch 되면 제너레이터를 next 한다. 일회용이 아님.
 * takeLatest 는 액션이 dispatch 되면 제너레이터를 next 한다. 이전 요청이 끝나지 않은게 있다면 이전 요청을 취소한다. (최후건만)
 * takeLeading 은 액션이 dispatch 되면 제너레이터를 next 한다. 이전 요청이 끝나지 않은게 있다면 이후의 요청을 무시한다.(최초건만)
 * throttle 은 액션이 dispatch 되면 제너레이터를 next 한다. 이전 요청이 끝나지 않은게 있다면 일정시간동안 요청을 무시한다.
 * delay 는 일정시간동안 기다린다.
 * debounce 는 일정시간동안 기다린다. 이벤트가 발생하고 일정시간동안 이벤트가 발생하지 않으면 제너레이터를 next 한다.
 */

import userSaga from './userSaga';
import postSaga from './postSaga';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true; // 쿠키를 주고받을 수 있게 해줌 패스포트에서 필수인듯

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga)]);
}
