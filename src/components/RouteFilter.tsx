import React, { useState, useEffect } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, FormHelperText, IconButton, MenuItem, Paper, Select } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { DifficultyLst } from '../util/Constants';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { RoutesFilter } from '../classes/RoutesFilter';

interface RouteFilterProps {
    FilterAreas: (filter: RoutesFilter) => void;
}

const RouteFilter: React.FC<RouteFilterProps> = (props: RouteFilterProps) => {
    const [routesFilter, setRoutesFilter] = useState<RoutesFilter>(new RoutesFilter());
    const [minErrorText, setMinErrorText] = useState<string>('');
    const [maxErrorText, setMaxErrorText] = useState<string>('');

    useEffect(() => {
        // Need to validate the difficulty values
        if (routesFilter.MinDiff !== '' && routesFilter.MaxDiff !== '') {
            if (DifficultyLst.indexOf(routesFilter.MinDiff) > DifficultyLst.indexOf(routesFilter.MaxDiff)) {
                setMaxErrorText('Too Small');
                setMinErrorText('Too Big');
            }
            else {
                setMaxErrorText('');
                setMinErrorText('');
            }
        }
        else {
            setMaxErrorText('');
            setMinErrorText('');
        }
    }, [routesFilter.MinDiff, routesFilter.MaxDiff])

    const ResetFilter = () => {
        setRoutesFilter(new RoutesFilter());
        props.FilterAreas(new RoutesFilter());
    }

    const FilterAreas = () => {
        if (minErrorText === '' && maxErrorText === '') {
            props.FilterAreas(routesFilter);
        }
    }

    const DifficultySelects = () => {
        return (
            DifficultyLst.map((x, y) => {
                return (<MenuItem key={y} value={x}>{x}</MenuItem>)
            })
        )
    }

    const StarButtons = () => {
        return (
            <div id="StarControlContainer" style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <IconButton id="OneStar" onClick={() => setRoutesFilter({ ...routesFilter, NumStars: 1 })}>
                    {routesFilter.NumStars >= 1 ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <IconButton id="TwoStars" onClick={() => setRoutesFilter({ ...routesFilter, NumStars: 2 })}>
                    {routesFilter.NumStars >= 2 ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <IconButton id="ThreeStars" onClick={() => setRoutesFilter({ ...routesFilter, NumStars: 3 })}>
                    {routesFilter.NumStars >= 3 ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
                <IconButton id="FourStars" onClick={() => setRoutesFilter({ ...routesFilter, NumStars: 4 })}>
                    {routesFilter.NumStars >= 4 ? <StarIcon /> : <StarBorderIcon />}
                </IconButton>
            </div>
        );
    }

    const DifficultySelectors = (
        <div>
            <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="minDiffLabel" style={{ fontSize: "14px" }}>Min Difficulty</InputLabel>
                <Select labelId="minDiffLabel" value={routesFilter.MinDiff} onChange={(event) => setRoutesFilter({ ...routesFilter, MinDiff: event.target.value })}
                    error={minErrorText !== ''}>
                    <MenuItem value="" />
                    {DifficultySelects()}
                </Select>
                <FormHelperText>{minErrorText}</FormHelperText>
            </FormControl>

            <FormControl variant="filled" sx={{ m: 1, minWidth: 123 }}>
                <InputLabel id="maxDiffLabel" style={{ fontSize: "14px" }}>Max Difficulty</InputLabel>
                <Select labelId="maxDiffLabel" value={routesFilter.MaxDiff} onChange={(event) => setRoutesFilter({ ...routesFilter, MaxDiff: event.target.value })}
                    error={maxErrorText !== ''} >
                    <MenuItem value="" />
                    {DifficultySelects()}
                </Select>
                <FormHelperText>{maxErrorText}</FormHelperText>
            </FormControl>
        </div>
    );

    const RouteTypeCheckboxes = (
        <div>
            <FormGroup sx={{ alignItems: "center" }}>
                <FormControlLabel control={
                    <Checkbox style={{ color: "var(--trad)" }} checked={routesFilter.ShowTrad} onChange={(event) => setRoutesFilter({ ...routesFilter, ShowTrad: event.target.checked })} />} label="Trad" />
                <FormControlLabel control={
                    <Checkbox style={{ color: "var(--tr)" }} checked={routesFilter.ShowTR} onChange={(event) => setRoutesFilter({ ...routesFilter, ShowTR: event.target.checked })} />} label="Top Rope" />
                <FormControlLabel control={
                    <Checkbox style={{ color: "var(--sport)" }} checked={routesFilter.ShowSport} onChange={(event) => setRoutesFilter({ ...routesFilter, ShowSport: event.target.checked })} />} label="Sport" />
            </FormGroup>
        </div>
    )

    return (
        <div id="RouteFilter" className="column" style={{ height: "685px" }}>
            <Paper id="BackgroundPaper" elevation={3} >
                <Paper id="HeaderPaper" elevation={3}>
                    Route Filter
                </Paper>

                <div id="AverageStars" style={{ padding: "10px 0px" }}>
                    <div id="StarsLabel" style={{ fontSize: "16px", fontWeight: 'bolder' }}>
                        Average Stars 1 - 4
                    </div>
                    {StarButtons()}
                </div>

                <div id="DifficultyRange">
                    <div style={{ fontSize: "16px", fontWeight: 'bolder' }}>
                        Climbing Difficulty
                    </div>
                    {DifficultySelectors}
                </div>

                <div id="RouteTypeFilter">
                    <div style={{ fontSize: "16px", fontWeight: 'bolder' }}>
                        Climbing Route Type(s)
                    </div>
                    {RouteTypeCheckboxes}
                </div>

                <div id="FilterButtons" style={{ display: "flex", flexDirection: "row", position: "absolute", bottom: "5px", right: "5px" }}>
                    <Button variant="outlined" startIcon={<ClearIcon />} onClick={ResetFilter} style={{ marginRight: "5px" }}>
                        Clear
                    </Button>
                    <Button variant="contained" endIcon={<FilterAltIcon />} onClick={FilterAreas}>
                        Filter
                    </Button>
                </div>
            </Paper>
        </div>
    );
}

export default RouteFilter;