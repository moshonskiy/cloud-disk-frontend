import { createSlice, createDraftSafeSelector, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

import { IUploadFile } from '../../entities/UploadFile';

interface InitState {
    isVisible: boolean;
    files: IUploadFile[];
}

const initialState: InitState = {
    isVisible: false,
    files: [],
}

const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        showUploader: (state) => {
            state.isVisible = true;
        },
        hideUploader: (state) => {
            state.isVisible = false;
        },
        addUploadFile: (state, action: PayloadAction<IUploadFile>) => {
            state.files.push(action.payload);
        },
        removeUploadFile: (state, action: PayloadAction<string>) => {
            const filteredFiles = state.files.filter((files) => files.id !== action.payload);
            state.files = filteredFiles;
        },
        changeUploadFile: (state, action: PayloadAction<IUploadFile>) => {
            const changedFiles = state.files.map((file) => (
                file.id === action.payload.id
                    ? { ...file, progress: action.payload.progress }
                    : { ...file }
            ));
            state.files = changedFiles;
        },
    },
});

const selectSelf = (state: RootState) => state;

export const selectIsVisible = createDraftSafeSelector(selectSelf, (state) => state.upload.isVisible);
export const selectUploadFiles = createDraftSafeSelector(selectSelf, (state) => state.upload.files);

export const { showUploader, hideUploader, addUploadFile, removeUploadFile, changeUploadFile } = uploadSlice.actions;
export const uploadReducer = uploadSlice.reducer;
