import React, { FunctionComponent, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { loginUser, selectErrorMessage } from '../../features/users/usersSlice';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

import s from './Login.module.scss';

const schema = yup.object().shape({
    email: yup.string().required().email('Enter valid email'),
    password: yup.string().required().min(5, 'Password should be 5 characters min'),
});

type FormData = yup.InferType<typeof schema>;

const Login: FunctionComponent = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const errorMessage = useAppSelector(selectErrorMessage);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: "onBlur",
        resolver: yupResolver(schema),
    });

    const onSubmit = (values: FormData) => {
        dispatch(loginUser(values))
            .unwrap()
            .then((res) => window.localStorage.setItem('token', res.token));
    }

    return (
        <>
            <Paper className={s.container}>
                <Typography
                    variant="h5"
                    className={s.header}
                >
                    Log in to account
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={cn(s.field, s.email)}>
                        <TextField
                            fullWidth
                            type="text"
                            placeholder="Enter email"
                            label="Email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </div>
                    <div className={s.field}>
                        <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            label="Password"
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        aria-label="Toggle password visibility"
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                )
                            }}
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    </div>
                    <Button
                        fullWidth
                        disabled={!isValid}
                        variant="contained"
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </Paper>
            {errorMessage && (
                <Alert
                    severity="error"
                    className={s.error}
                >
                    {errorMessage}
                </Alert>
            )}
        </>
    );
};

export default Login;
