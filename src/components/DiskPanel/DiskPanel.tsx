import React, { FunctionComponent } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import {
    setCurrentDir,
    popDirectoryStack,
    changeListView,
    selectdirectoryStack,
} from '../../features/files/filesSlice';

import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppsIcon from '@mui/icons-material/Apps';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InfoIcon from '@mui/icons-material/Info';

import AddFileButton from '../AddFileButton';
import SortSelect from '../SortSelect';

import s from './DiskPanel.module.scss';

interface DiskPanelProps {
    setShowDialog: (val: boolean) => void;
}

const DiskPanel: FunctionComponent<DiskPanelProps> = ({ setShowDialog }) => {
    const dispatch = useAppDispatch();
    const directoryStack = useAppSelector(selectdirectoryStack);

    const handleBackDir = () => {
        dispatch(popDirectoryStack());
        const backDirId = directoryStack[directoryStack.length-1];

        dispatch(setCurrentDir(backDirId));
    }

    return (
        <div className={s.disk__btns}>
            <div className={s.left}>
                <Button onClick={handleBackDir}>
                    <ArrowBackIcon />
                </Button>
                <Button
                    onClick={() => setShowDialog(true)}
                >
                    Create Folder
                </Button>

                <AddFileButton
                    multiple
                    text="Add file"
                />

                <Tooltip title="You can drag and drop files as well">
                    <InfoIcon color="primary" />
                </Tooltip>
            </div>

            <div className={s.right}>
                <SortSelect />

                <div className={s.disk__layoutBtns}>
                    <Button onClick={() => dispatch(changeListView('list'))}>
                        <FormatListBulletedIcon />
                    </Button>
                    <Button onClick={() => dispatch(changeListView('plate'))}>
                        <AppsIcon />
                    </Button>

                </div>
            </div>

        </div>
    )
};

export default DiskPanel;
