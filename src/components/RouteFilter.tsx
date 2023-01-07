import React, {useState, useEffect} from 'react';
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
    const [filter, setFilter] = useState<RoutesFilter>(new RoutesFilter());
    
    const [minErrorText, setMinErrorText] = useState<string>('');
    const [maxErrorText, setMaxErrorText] = useState<string>('');

    useEffect(() => {
        validateDiffValues();
    }, [filter.MinDiff, filter.MaxDiff])

    const validateDiffValues = () => {
        if(filter.MinDiff !== '' && filter.MaxDiff !== ''){
            if(DifficultyLst.indexOf(filter.MinDiff) > DifficultyLst.indexOf(filter.MaxDiff)){
                setMaxErrorText('Too Small');
                setMinErrorText('Too Big');
            }
            else{
                setMaxErrorText('');
                setMinErrorText('');
            }
        }
        else{
            setMaxErrorText('');
            setMinErrorText('');
        }
    }

    const ResetFilter = () => {
        setFilter(new RoutesFilter());
    }

    const FilterAreas = () => {
        if(filter.NumStars > 0 || filter.MinDiff !== '' || filter.MaxDiff !== ''
            && (minErrorText === '' && maxErrorText === '')){
            
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
            <div id="StarControlContainer" style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
                <IconButton id="OneStar" onClick={() => setFilter({...filter, NumStars: 1})}>
                    {filter.NumStars >= 1 ? <StarIcon/> : <StarBorderIcon/>}
                </IconButton>
                <IconButton id="TwoStars" onClick={() => setFilter({...filter, NumStars: 2})}>
                    {filter.NumStars >= 2 ? <StarIcon/> : <StarBorderIcon/>} 
                </IconButton>
                <IconButton id="ThreeStars" onClick={() => setFilter({...filter, NumStars: 3})}>
                    {filter.NumStars >= 3 ? <StarIcon/> : <StarBorderIcon/>}   
                </IconButton>
                <IconButton id="FourStars" onClick={() => setFilter({...filter, NumStars: 4})}>
                    {filter.NumStars >= 4 ? <StarIcon/> : <StarBorderIcon/>}
                </IconButton>
            </div>
        );
    }

    const DifficultySelectors = (
        <div>
            <FormControl variant='filled' sx={{m: 1, minWidth: 120}}>
                <InputLabel id="minDiffLabel" style={{fontSize: "14px"}}>Min Difficulty</InputLabel>
                <Select labelId="minDiffLabel" value={filter.MinDiff} onChange={(event) => setFilter({...filter, MinDiff: event.target.value})} 
                    error={minErrorText !== ''}>
                    <MenuItem value=""/>
                    {DifficultySelects()}
                </Select>
                <FormHelperText>{minErrorText}</FormHelperText>
            </FormControl>

            <FormControl variant="filled" sx={{m: 1, minWidth: 123}}>
                <InputLabel id="maxDiffLabel" style={{fontSize: "14px"}}>Max Difficulty</InputLabel> 
                <Select labelId="maxDiffLabel" value={filter.MaxDiff} onChange={(event) => setFilter({...filter, MaxDiff: event.target.value})} 
                    error={maxErrorText !== ''} >
                    <MenuItem value=""/>
                    {DifficultySelects()}
                </Select>
                <FormHelperText>{maxErrorText}</FormHelperText>
            </FormControl>
        </div>
    );

    const RouteTypeCheckboxes = (
        <div>
            <FormGroup sx={{alignItems: "center"}}>
                <FormControlLabel control={
                    <Checkbox checked={filter.ShowTrad} onChange={(event) => setFilter({...filter, ShowTrad: event.target.checked})} />} label="Trad" />
                <FormControlLabel control={
                    <Checkbox checked={filter.ShowTR} onChange={(event) => setFilter({...filter, ShowTR: event.target.checked})} />} label="Top Rope" />
                <FormControlLabel control={
                    <Checkbox checked={filter.ShowSport} onChange={(event) => setFilter({...filter, ShowSport: event.target.checked})} />} label="Sport" />
            </FormGroup>
        </div>
    )

    return (
        <div id="RouteFilter" className="column" style={{ height: "685px"}}>
            <Paper id="BackgroundPaper" elevation={3} >
                <Paper id="HeaderPaper" elevation={3}>
                    Route Filter
                </Paper>

                <div id="AverageStars" style={{ padding: "10px 0px"}}>
                    <div id="StarsLabel" style={{fontSize: "16px", fontWeight: 'bolder'}}>
                        Average Stars 1 - 4
                    </div>
                    {StarButtons()}
                </div>

               <div id="DifficultyRange">
                    <div style={{fontSize: "16px", fontWeight: 'bolder'}}>
                        Climbing Difficulty
                    </div>
                    {DifficultySelectors}
               </div>

               <div id="RouteTypeFilter">
                    <div style={{fontSize: "16px", fontWeight: 'bolder'}}>
                        Climbing Route Type(s)
                    </div>
                    {RouteTypeCheckboxes}
               </div>

                <div id="FilterButtons" style={{display: "flex", flexDirection: "row", position: "absolute", bottom: "5px", right: "5px"}}>
                    <Button variant="outlined" startIcon={<ClearIcon />} onClick={ResetFilter} style={{marginRight: "5px"}}>
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