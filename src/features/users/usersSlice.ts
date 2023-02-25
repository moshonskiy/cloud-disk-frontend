import { createSlice, createAsyncThunk, createDraftSafeSelector } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import axiosInstance from '../../api/axiosInstance';
import { IUser, TokenUser } from '../../entities/User';
import { RegistrationParams } from '../../entities/Auth';
import { RootState } from '../../store';

interface InitState {
    currentUser: IUser | null;
    isAuth: boolean;
    status: 'idle' | 'loading' | 'received' | 'rejected';
    error: null | string | undefined;
}

const initialState: InitState = {
    currentUser: null,
    isAuth: false,
    status: 'idle',
    error: null,
};

interface ValidationErrors {
    message: string;
    field_errors: Record<string, string>;
}

export const registerUser = createAsyncThunk<
    IUser,
    RegistrationParams,
    { rejectValue: ValidationErrors }
>('users/registerUser', async (params, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<IUser>('/auth/registration', params);
        return data;
    } catch (err) {
        let error = err as AxiosError<ValidationErrors>;
        if (!error.response) {
            throw err;
        }
        return rejectWithValue(error.response.data);
    }
});

export const loginUser = createAsyncThunk<
    TokenUser,
    RegistrationParams,
    { rejectValue: ValidationErrors }
>('users/loginUser', async (params, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.post<TokenUser>('/auth/login', params);
        window.localStorage.setItem('token', data.token);

        return data;
    } catch (err) {
        let error = err as AxiosError<ValidationErrors>;
        if (!error.response) {
            throw err;
        }
        return rejectWithValue(error.response.data);
    }
});

export const authCheck = createAsyncThunk<
    TokenUser,
    undefined,
    { rejectValue: ValidationErrors }
>('users/authCheck', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.get<TokenUser>('/auth/check');

        return data;
    } catch (err) {
        let error = err as AxiosError<ValidationErrors>;
        if (!error.response) {
            throw err;
        }
        return rejectWithValue(error.response.data);
    }
});

export const addAvatar = createAsyncThunk<
    IUser,
    File,
    { rejectValue: ValidationErrors }
>('users/addAvatar', async (file, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await axiosInstance.post<IUser>('/files/avatar', formData);

        return data;
    } catch (err) {
        let error = err as AxiosError<ValidationErrors>;
        if (!error.response) {
            throw err;
        }
        return rejectWithValue(error.response.data);
    }
});

export const deleteAvatar = createAsyncThunk<
    IUser,
    undefined,
    { rejectValue: ValidationErrors }
>('users/deleteAvatar', async (_, { rejectWithValue }) => {
    try {
        const { data } = await axiosInstance.delete<IUser>('/files/avatar');

        return data;
    } catch (err) {
        let error = err as AxiosError<ValidationErrors>;
        if (!error.response) {
            throw err;
        }
        return rejectWithValue(error.response.data);
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.isAuth = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'received';
                state.currentUser = action.payload;
                state.isAuth = true;
            })
            .addCase(loginUser.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'received';
                state.currentUser = action.payload.user;
                state.isAuth = true;
            })
            .addCase(authCheck.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(authCheck.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(authCheck.fulfilled, (state, action) => {
                state.status = 'received';
                state.currentUser = action.payload.user;
                state.isAuth = true;
            })
            .addCase(addAvatar.pending, (state, action) => {
                state.error = null;
            })
            .addCase(addAvatar.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(addAvatar.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            .addCase(deleteAvatar.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteAvatar.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
            })
            .addCase(deleteAvatar.fulfilled, (state) => {
                if (state.currentUser && state.currentUser.avatar) {
                    state.currentUser.avatar = null;
                }
            });
    }
});

const selectSelf = (state: RootState) => state;

export const selectCurrentUser = createDraftSafeSelector(selectSelf, (state) => state.users.currentUser);
export const selectIsAuth = createDraftSafeSelector(selectSelf, (state) => state.users.isAuth);
export const selectStatus = createDraftSafeSelector(selectSelf, (state) => state.users.status);
export const selectUserAvatar = createDraftSafeSelector(selectSelf, (state) => state.users.currentUser?.avatar);
export const selectErrorMessage = createDraftSafeSelector(selectSelf, (state) => state.users.error);

export const { logout } = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
