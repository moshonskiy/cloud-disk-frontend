import React, { FunctionComponent, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import Button from '@mui/material/Button';

import s from './AddFileButton.module.scss';
import { uploadFile, selectCurrentDir } from '../../features/files/filesSlice';

interface AddFileButtonProps {
    text: string;
    multiple?: boolean;
}

const AddFileButton: FunctionComponent<AddFileButtonProps> = ({ text, multiple }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const currentDir = useAppSelector(selectCurrentDir)

    const handleAddFile = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach((file) => {
                dispatch(uploadFile({ dirId: currentDir, file }));
            })
        }
    }

    return (
        <div className={s.addFileButton}>
            <Button
                onClick={handleAddFile}
            >
                {text}
            </Button>
            <div className={s.addFileButton__input}>
                <input
                    type="file"
                    multiple={multiple}
                    ref={inputRef}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    );
};

export default AddFileButton;
