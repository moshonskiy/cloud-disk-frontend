import { configureStore } from '@reduxjs/toolkit';

import { usersReducer } from './features/users/usersSlice';
import { filesReducer } from './features/files/filesSlice';
import { uploadReducer } from './features/upload/uploadSlice';

const store = configureStore({
    reducer: {
        users: usersReducer,
        files: filesReducer,
        upload: uploadReducer,
    },
    devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
