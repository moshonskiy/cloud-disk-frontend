import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';

import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './components/Profile';

import { useAppDispatch, useAppSelector } from './hooks';
import { authCheck, selectIsAuth, selectStatus } from './features/users/usersSlice';

import s from './App.module.scss';

function App() {
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector(selectIsAuth);
    const status = useAppSelector(selectStatus);

    useEffect(() => {
        dispatch(authCheck());
    }, [dispatch]);

    return (
        <div className={s.app}>
            <Header />
            {!isAuth && status !== 'loading' && (
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/registration' element={<Registration />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='*' element={<Navigate to='/' />} />
                </Routes>
            )}
            {isAuth && (
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='*' element={<Navigate to='/' />} />
                </Routes>
            )}
        </div>
    );
}

export default App;
