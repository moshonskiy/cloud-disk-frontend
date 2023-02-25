import React, { FunctionComponent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import cn from 'classnames';

import { IFile } from '../../entities/File';

import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import DeleteIcon from '@mui/icons-material/Delete';

import { setCurrentDir, pushDirectoryToStack, selectFilesView, selectCurrentDir, deleteFile } from '../../features/files/filesSlice';
import { downloadFile } from '../../utils/downloadFile';
import { formatBytes } from '../../utils/formatBytes';

import s from './File.module.scss';

interface FileProps {
    file: IFile;
}

const File: FunctionComponent<FileProps> = ({ file }) => {
    const icon = file.type === 'dir' ? <FolderIcon className={s.icon} /> : <InsertDriveFileIcon className={s.icon} />;
    const date = new Date(file.date).toLocaleDateString();
    const dispatch = useAppDispatch();
    const currentDir = useAppSelector(selectCurrentDir);
    const filesView = useAppSelector(selectFilesView);

    const handleOpen = (id: string, type: string) => {
        if (type === 'dir') {
            dispatch(setCurrentDir(id));
            dispatch(pushDirectoryToStack(currentDir));
        }
    };

    const handleDownloadFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        downloadFile(file)
    };

    const handleDeleteFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        dispatch(deleteFile(file));
    }

    if (filesView === 'plate') {
        return (
            <div
                onClick={() => handleOpen(file._id, file.type)}
                className={cn(s.file, s.file__plate, { [s.file__cursor]: file.type === 'dir' })}
            >
                {icon}
                <div className={s.file__name}>{file.name}</div>
                <div className={s.plateActions}>
                    {file.type !== 'dir' && (
                        <Button
                            className={s.file__downloadButton}
                            onClick={handleDownloadFile}
                        >
                            <CloudDownloadIcon />
                        </Button>
                    )}
                    <Button
                        className={s.file__deleteButton}
                        onClick={handleDeleteFile}
                    >
                        <DeleteIcon />
                    </Button>
                </div>

            </div>
        )
    }

    return (
        <div
            onClick={() => handleOpen(file._id, file.type)}
            className={cn(s.file, { [s.file__cursor]: file.type === 'dir' })}
        >
            <div className={s.file__left}>
                {icon}
                <div className={s.file__name}>
                    {file.name}
                </div>
            </div>

            <div className={s.file__right}>
                <div className={s.file__date}>{date}</div>
                {file.type !== 'dir' && (
                    <div className={s.file__size}>
                        {formatBytes(file.size)}
                    </div>
                )}
                <div className={s.actions}>
                    {file.type !== 'dir' && (
                        <Button
                            className={s.file__downloadButton}
                            onClick={handleDownloadFile}
                        >
                            <CloudDownloadIcon />
                        </Button>
                    )}
                    <Button
                        className={s.file__deleteButton}
                        onClick={handleDeleteFile}
                    >
                        <DeleteIcon />
                    </Button>
                </div>

            </div>

        </div>
    )
};

export default File;
