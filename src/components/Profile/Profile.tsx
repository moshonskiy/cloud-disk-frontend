import React, { FunctionComponent, useRef } from 'react';

import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

import { useAppDispatch, useAppSelector } from '../../hooks';

import { deleteAvatar, addAvatar, selectUserAvatar } from '../../features/users/usersSlice';

import s from './Profile.module.scss';

const Profile: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const avatar = useAppSelector(selectUserAvatar);

    const inputRef = useRef<HTMLInputElement>(null);

    const handleDeleteAvatar = () => {
        dispatch(deleteAvatar());
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);

            dispatch(addAvatar(files[0]));
        }
    }

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    }

    return (
        <Paper className={s.profile}>
            <div>
                <Button
                    onClick={handleClick}
                    disabled={!!avatar}
                >
                    Add avatar
                </Button>
                <input
                    type="file"
                    ref={inputRef}
                    accept="image/*"
                    className={s.input}
                    onChange={handleChange}
                />
            </div>
            <Button
                onClick={handleDeleteAvatar}
                disabled={!avatar}
            >
                Delete avatar
            </Button>
        </Paper>
    )
};

export default Profile;
