import React, { useState, FunctionComponent, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';

import { selectCurrentDir } from '../../features/files/filesSlice';

import TextField from '@mui/material/TextField';

import { getFiles, searchFile } from '../../features/files/filesSlice';
import useDebounce from '../../customHooks/useDebounce';

import s from './SearchInput.module.scss';

const SearchInput: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const currentDir = useAppSelector(selectCurrentDir);
    const [search, setSearch] = useState('');
    const debouncedValue = useDebounce<string>(search, 500);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    useEffect(() => {
        if (!debouncedValue) {
            dispatch(getFiles({ dirId: currentDir, sort: '' }));
        } else {
            dispatch(searchFile(debouncedValue));
        }
    }, [debouncedValue, dispatch, currentDir]);

    return (
        <div className={s.searchInput}>
            <TextField
                value={search}
                onChange={handleSearch}
                placeholder="Enter file to search"
            />
        </div>
    );
};

export default SearchInput;
