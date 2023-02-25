import React, { FunctionComponent } from 'react';

import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import UploadFile from './UploadFile';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectIsVisible, selectUploadFiles, hideUploader } from '../../features/upload/uploadSlice';

import s from './Uploader.module.scss';

const Uploader: FunctionComponent = () => {
    const files = useAppSelector(selectUploadFiles);

    const dispatch = useAppDispatch();
    const isVisible = useAppSelector(selectIsVisible);

    const handleCloseDialog = () => {
        dispatch(hideUploader());
    }

    return (
        <Dialog
            onClose={handleCloseDialog}
            open={isVisible}
            className={s.dialog}
        >
            <DialogTitle align="center">
                Downloads
            </DialogTitle>
            <Container className={s.container}>
                {files.map((file) => (
                    <UploadFile key={file.name} file={file} />
                ))}
            </Container>
        </Dialog>
    )
};

export default Uploader;
