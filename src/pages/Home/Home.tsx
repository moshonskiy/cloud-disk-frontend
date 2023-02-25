import React, { FunctionComponent, useState } from 'react';

import Container from '@mui/material/Container';

import Disk from '../../components/Disk';
import DiskPanel from '../../components/DiskPanel';
import SearchInput from '../../components/SearchInput';
import CreateDirectoryDialog from '../../components/CreateDirectoryDialog';
import Uploader from '../../components/Uploader';

import s from './Home.module.scss';

const Home: FunctionComponent = () => {
    const [showDialog, setShowDialog] = useState(false);

    return (
        <div className={s.home}>
            <Container>
                <SearchInput />
                <DiskPanel
                    setShowDialog={setShowDialog}
                />
                <Disk />

                {showDialog && (
                    <CreateDirectoryDialog
                        showDialog={showDialog}
                        setShowDialog={setShowDialog}
                    />
                )}
                <Uploader />
            </Container>
        </div>
    );
};

export default Home;
