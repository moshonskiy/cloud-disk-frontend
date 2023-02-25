import React, { FunctionComponent, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import {
    getFiles,
    uploadFile,
    selectCurrentDir,
    selectFilesStatus,
    selectSort,
    selectError,
} from '../../features/files/filesSlice';

import FileList from '../FileList';


import s from './Disk.module.scss';
import { Box } from '@mui/material';

const Disk: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const currentDir = useAppSelector(selectCurrentDir);
    const filesStatus = useAppSelector(selectFilesStatus);
    const sort = useAppSelector(selectSort);
    const error = useAppSelector(selectError);

    const [dragEnter, setDragEnter] = useState(false);


    useEffect(() => {
        dispatch(getFiles({ dirId: currentDir, sort: sort }));
    }, [dispatch, currentDir, sort]);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragEnter(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragEnter(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);

        files.forEach((file) => {
            dispatch(uploadFile({ dirId: currentDir, file }));
        })

        setDragEnter(false);
    };



    if (filesStatus === 'loading') {
        return (
            <Box sx={{ width: '100%' }}>
                <div className={s.loader}>
                    <CircularProgress />
                </div>
            </Box>
        )
    }

    const dndArea = (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
            onDrop={handleDrop}
            className={s.disk}
        >
            <Paper className={s.dndArea}>
                Drag and drop files here
            </Paper>
        </div>
    );

    if (dragEnter) {
        return dndArea;
    }

    return (
        <div
            className={s.disk}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragEnter}
        >

                <FileList />
                {error && (
                    <Alert severity="error">
                        {error}
                    </Alert>
                )}
        </div>
    )
};

export default Disk;
