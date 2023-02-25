import React, { FunctionComponent } from 'react';

import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { IUploadFile } from '../../entities/UploadFile';

import s from './Uploader.module.scss';
import { useAppDispatch } from '../../hooks';
import { removeUploadFile } from '../../features/upload/uploadSlice';


interface UploadFileProps {
    file: IUploadFile;
}

const UploadFile: FunctionComponent<UploadFileProps> = ({
    file,
}) => {
    const dispatch = useAppDispatch();

    const handleDeleteFile = () => {
        dispatch(removeUploadFile(file.id));
    }

    return (
        <div className={s.fileItem}>
            <div className={s.fileItem__header}>
                <div
                    className={s.fileItem__name}
                >
                    {file.name}
                </div>
                <Button
                    onClick={handleDeleteFile}
                >
                    <DeleteIcon />
                </Button>
            </div>
            <Box className={s.fileItem__progressBar}>
                <Box sx={{ width: '100%', mr: 1 }}>
                    <LinearProgress
                        value={file.progress}
                        variant="determinate"
                    />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">
                        {`${file.progress}%`}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
};

export default UploadFile;
