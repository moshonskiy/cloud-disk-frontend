import React, { FunctionComponent } from 'react';
import { useAppDispatch, useAppSelector  } from '../../hooks';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { selectSort, setSort } from '../../features/files/filesSlice';

const SortSelect: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const sort = useAppSelector(selectSort);

    const handleChange = (e: SelectChangeEvent) => {
        dispatch(setSort(e.target.value));
    };

    return (
        <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sort</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={sort}
          label="Sort"
          onChange={handleChange}
        >
          <MenuItem value="name">By name</MenuItem>
          <MenuItem value="type">By type</MenuItem>
          <MenuItem value="date">By date</MenuItem>
        </Select>
      </FormControl>
    </Box>
    );
};

export default SortSelect;
