import React, { FunctionComponent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useForm } from 'react-hook-form';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';

import { createDir, selectCurrentDir } from '../../features/files/filesSlice';

import s from './CreateDirectoryDialog.module.scss';

const schema = yup.object().shape({
    name: yup.string().required(),
});

type FormState = yup.InferType<typeof schema>;

interface CreateDirectoryDialogProps {
    showDialog: boolean;
    setShowDialog: (val: boolean) => void;
}

const CreateDirectoryDialog: FunctionComponent<CreateDirectoryDialogProps> = ({
    showDialog,
    setShowDialog,
}) => {
    const dispatch = useAppDispatch();
    const currentDir = useAppSelector(selectCurrentDir);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm({
        defaultValues: {
            name: '',
        },
        mode: 'onBlur',
        resolver: yupResolver(schema),
    });

    const handleCloseDialog = () => {
        setShowDialog(false);
    }

    const onSubmit = (values: FormState) => {
        const params = {
            dirId: currentDir,
            dirName: values.name,
        }

        dispatch(createDir(params));
        setShowDialog(false);
        reset();
    }

    return (
        <Dialog
            onClose={handleCloseDialog}
            open={showDialog}
        >
            <DialogTitle align="center">Type in directory name</DialogTitle>
            <Container>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={s.dialogTextField}>
                        <TextField
                            fullWidth
                            {...register('name')}
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </div>
                    <div className={s.dialogButton}>
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={!isValid}
                        >
                            Create
                        </Button>
                    </div>
                </form>
            </Container>
        </Dialog>
    );
};

export default CreateDirectoryDialog;
