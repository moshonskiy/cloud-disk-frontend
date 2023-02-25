import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

import { IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout, selectIsAuth, selectStatus, selectUserAvatar } from '../../features/users/usersSlice';

import { API_URL } from '../../config';

import s from './Header.module.scss';

const Header: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(selectIsAuth);
    const status = useAppSelector(selectStatus);
    const userAvatar = useAppSelector(selectUserAvatar);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to log out?')) {
            dispatch(logout());
            window.localStorage.removeItem('token');
        }
    }

    return (
        <header className={s.header}>
            <Container>
                <div className={s.header__container}>
                    <Link
                        to="/"
                        className={s.link}
                    >
                        <IconButton className={s.icon}>
                            <SaveIcon />
                        </IconButton>
                    </Link>
                    <div className={s.name}>Cloud Disk</div>
                    <div className={s.actions}>
                        {!isAuth && status !== 'loading' && (
                            <>
                                <Link
                                    to="/login"
                                    className={s.link}
                                >
                                    <Button
                                        variant="contained"
                                    >
                                        Login
                                    </Button>
                                </Link>

                                <div className={s.registerButton}>
                                    <Link
                                        to="/registration"
                                        className={s.link}
                                    >
                                        <Button
                                            variant="outlined"
                                        >
                                            Registration
                                        </Button>
                                    </Link>
                                </div>
                            </>
                        )}
                        {isAuth && status !== 'loading' && (
                            <Button
                                variant="contained"
                                color="error"
                                onClick={handleLogout}
                            >Sign out</Button>
                        )}
                        {isAuth && (
                            <Link to="/profile">
                                <div className={s.avatarWrapper}>
                                    {userAvatar ? (
                                        <img
                                            className={s.avatarImg}
                                            alt="User avatar"
                                            src={`${API_URL}${userAvatar}`}
                                        />
                                    ) : (
                                        <AccountCircleIcon className={s.defaultIcon} />
                                    )}
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;
