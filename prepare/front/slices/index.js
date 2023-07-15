import { combineReducers } from '@reduxjs/toolkit';

import userSlice from './userSlice';
import postSlice from './postSlice';
import { HYDRATE } from 'next-redux-wrapper';

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return {
        ...state,
        ...action.payload,
      };

    default: {
      return combineReducers({
        user: userSlice.reducer,
        post: postSlice.reducer,
      })(state, action);
    }
  }
};

export default rootReducer;
