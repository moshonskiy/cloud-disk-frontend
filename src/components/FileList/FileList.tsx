import React, { FunctionComponent } from 'react';

import { useAppSelector } from '../../hooks';
import { selectFiles, selectFilesView } from '../../features/files/filesSlice';

import File from '../File/File';

import { IFile } from '../../entities/File';

import s from './FileList.module.scss';

const FileList: FunctionComponent = () => {
    const files = useAppSelector(selectFiles);
    const filesView = useAppSelector(selectFilesView);

    if (files.length === 0) {
        return (
            <div className={s.emptyFolder}>
                No files in this directory
            </div>
        )
    }

    const list = files.map((file: IFile) => (<File key={file._id} file={file} />));

    if (filesView === 'plate') {
        return (
            <div className={s.filePlate}>
                {list}
            </div>
        );
    }

    return (
        <div className={s.fileList}>
            {list}
        </div>
    )
};

export default FileList;
