import { combineReducers } from '@reduxjs/toolkit';

import userSlice from './userSlice';
import postSlice from './postSlice';

const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});

export default rootReducer;
