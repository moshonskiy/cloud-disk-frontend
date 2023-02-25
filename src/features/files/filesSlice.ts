import { createSlice, createAsyncThunk, nanoid, createDraftSafeSelector, PayloadAction } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import axiosInstance from '../../api/axiosInstance';
import { RootState } from '../../store';

import { IFile } from '../../entities/File';
import { IUploadFile } from '../../entities/UploadFile';
import { addUploadFile, showUploader, changeUploadFile } from '../upload/uploadSlice';
import { combineUrlParams } from '../../utils/combineUrlParams';

interface InitState {
    files: IFile[],
    currentDir: null | string | undefined;
    status: 'idle' | 'loading' | 'rejected' | 'received';
    error: null | string | undefined;
    directoryStack: string[];
    view: 'list' | 'plate';
    sort: string;
}

const initialState: InitState = {
    files: [],
    currentDir: null,
    status: 'idle',
    error: null,
    directoryStack: [],
    view: 'list',
    sort: '',
}

interface ValidationErrors {
    message: string;
    field_errors: Record<string, string>;
}

export const getFiles = createAsyncThunk<
    IFile[],
    {
        dirId: string | undefined | null,
        sort: string,
    },
    { rejectValue: ValidationErrors }
>(
    'files/getFiles',
    async ({ dirId, sort }, { rejectWithValue }) => {
        try {
            const params = combineUrlParams(dirId, sort);

            const { data } = await axiosInstance.get<IFile[]>('files', { params });

            return data;
        } catch (err) {
            let error = err as AxiosError<ValidationErrors>;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const createDir = createAsyncThunk<
    IFile,
    { dirId: string | null | undefined, dirName: string },
    { rejectValue: ValidationErrors }
>(
    'files/createDir',
    async ({ dirId, dirName }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post<IFile>('files', {
                name: dirName,
                parent: dirId,
                type: 'dir',
            });

            return data;
        } catch (err) {
            let error = err as AxiosError<ValidationErrors>;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const uploadFile = createAsyncThunk<
    IFile,
    { dirId: string | null | undefined, file: File },
    { rejectValue: ValidationErrors }
>(
    'files/uploadFile',
    async ({ dirId, file }, { rejectWithValue, dispatch }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if (dirId) {
                formData.append('parent', dirId);
            }

            let uploadFile: IUploadFile = {
                name: file.name,
                progress: 0,
                id: nanoid(),
            };
            dispatch(showUploader());
            dispatch(addUploadFile(uploadFile));

            const { data } = await axiosInstance.post<IFile>('files/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);

                    const updatedUploadFile: IUploadFile = {
                        ...uploadFile,
                        progress: percentCompleted,
                    }
                    dispatch(changeUploadFile(updatedUploadFile));
                }
            });

            return data;
        } catch (err) {
            let error = err as AxiosError<ValidationErrors>;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const deleteFile = createAsyncThunk<
    string,
    IFile,
    { rejectValue: ValidationErrors }
>(
    'files/deleteFile',
    async (file, { rejectWithValue }) => {
        try {
            await axiosInstance.delete<string>('files', { params: { id: file._id } });

            return file._id;
        } catch (err) {
            let error = err as AxiosError<ValidationErrors>;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    }
);

export const searchFile = createAsyncThunk<
    IFile[],
    string,
    { rejectValue: ValidationErrors }
>(
    'files/searchFile',
    async (query, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get<IFile[]>('files/search', { params: { search: query } });

            return data;
        } catch (err) {
            let error = err as AxiosError<ValidationErrors>;
            if (!error.response) {
                throw err;
            }
            return rejectWithValue(error.response.data);
        }
    }
)

const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<[]>) => {
            state.files = action.payload;
        },
        setCurrentDir: (state, action: PayloadAction<string | undefined>) => {
            state.currentDir = action.payload;
        },
        pushDirectoryToStack: (state, action: PayloadAction<string | null | undefined>) => {
            if (typeof action.payload === 'string') {
                state.directoryStack.push(action.payload);
            }
        },
        popDirectoryStack: (state) => {
            state.directoryStack.pop();
        },
        changeListView: (state, action: PayloadAction<'list' | 'plate'>) => {
            state.view = action.payload;
        },
        setSort: (state, action: PayloadAction<string>) => {
            state.sort = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFiles.pending, (state, action) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getFiles.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(getFiles.fulfilled, (state, action) => {
                state.files = action.payload;
                state.status = 'received';
            })
            .addCase(createDir.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createDir.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(createDir.fulfilled, (state, action) => {
                state.files.push(action.payload);
                state.status = 'received';
            })
            .addCase(uploadFile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(uploadFile.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(uploadFile.fulfilled, (state, action) => {
                state.files.push(action.payload);
                state.status = 'received';
            })
            .addCase(deleteFile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(deleteFile.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(deleteFile.fulfilled, (state, action) => {
                const filteredFiles = state.files.filter((file) => file._id !== action.payload);
                state.files = filteredFiles;
                state.status = 'received';
            })
            .addCase(searchFile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(searchFile.rejected, (state, action) => {
                if (action.payload) {
                    state.error = action.payload.message;
                } else {
                    state.error = action.error.message;
                }
                state.status = 'rejected';
            })
            .addCase(searchFile.fulfilled, (state, action) => {
                state.files = action.payload;
                state.status = 'received';
            })
    }
});

const selectSelf = (state: RootState) => state;

export const selectCurrentDir = createDraftSafeSelector(selectSelf, (state) => state.files.currentDir);
export const selectFiles = createDraftSafeSelector(selectSelf, (state) => state.files.files);
export const selectdirectoryStack = createDraftSafeSelector(selectSelf, (state) => state.files.directoryStack);
export const selectFilesStatus = createDraftSafeSelector(selectSelf, (state) => state.files.status);
export const selectFilesView = createDraftSafeSelector(selectSelf, (state) => state.files.view);
export const selectSort = createDraftSafeSelector(selectSelf, (state) => state.files.sort);
export const selectError = createDraftSafeSelector(selectSelf, (state) => state.files.error);

export const { setFiles, setCurrentDir, pushDirectoryToStack, popDirectoryStack, changeListView, setSort } = filesSlice.actions;

export const filesReducer = filesSlice.reducer;
