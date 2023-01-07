import React, {useState, useEffect} from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, FormHelperText, IconButton, MenuItem, Paper, Select } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { DifficultyLst } from '../util/Constants';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

interface RouteFilterProps {
    ElementId: string;
}

const RouteFilter: React.FC<RouteFilterProps> = (props: RouteFilterProps) => {
    const [numStars, setNumStars] = useState<number>(0);
    const [minDiff, setMinDiff] = useState<string>('');
    const [maxDiff, setMaxDiff] = useState<string>('');
    const [minErrorText, setMinErrorText] = useState<string>('');
    const [maxErrorText, setMaxErrorText] = useState<string>('');
    const [showTrad, setShowTrad] = useState<boolean>(true);
    const [showSport, setShowSport] = useState<boolean>(true);
    const [showTR, setShowTR] = useState<boolean>(true);

    useEffect(() => {
        validateDiffValues();
    }, [minDiff, maxDiff])

    const validateDiffValues = () => {
        if(minDiff !== '' && maxDiff !== ''){
            if(DifficultyLst.indexOf(minDiff) > DifficultyLst.indexOf(maxDiff)){
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
        setNumStars(0);
        setMinDiff('');
        setMaxDiff('');
        setShowTrad(true);
        setShowSport(true);
        setShowTR(true);
    }

    const FilterAreas = () => {
        if(numStars > 0 || minDiff !== '' || maxDiff !== ''
            && (minErrorText === '' && maxErrorText === '')){
            console.log("There was a valid filter")
        }
        else{
            console.log("There was no filter")
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
                <IconButton id="OneStar" onClick={() => setNumStars(1)}>
                    {numStars >= 1 ? <StarIcon/> : <StarBorderIcon/>}
                </IconButton>
                <IconButton id="TwoStars" onClick={() => setNumStars(2)}>
                    {numStars >= 2 ? <StarIcon/> : <StarBorderIcon/>} 
                </IconButton>
                <IconButton id="ThreeStars" onClick={() => setNumStars(3)}>
                    {numStars >= 3 ? <StarIcon/> : <StarBorderIcon/>}   
                </IconButton>
                <IconButton id="FourStars" onClick={() => setNumStars(4)}>
                    {numStars >= 4 ? <StarIcon/> : <StarBorderIcon/>}
                </IconButton>
                <IconButton id="FiveStars" onClick={() => setNumStars(5)}>
                    {numStars >= 5 ? <StarIcon/> : <StarBorderIcon/>}
                </IconButton>
            </div>
        );
    }

    const DifficultySelectors = (
        <div>
            <FormControl variant='filled' sx={{m: 1, minWidth: 120}}>
                <InputLabel id="minDiffLabel" style={{fontSize: "14px"}}>Min Difficulty</InputLabel>
                <Select labelId="minDiffLabel" value={minDiff} onChange={(event) => setMinDiff(event.target.value)} error={minErrorText !== ''}>
                    <MenuItem value=""/>
                    {DifficultySelects()}
                </Select>
                <FormHelperText>{minErrorText}</FormHelperText>
            </FormControl>

            <FormControl variant="filled" sx={{m: 1, minWidth: 123}}>
                <InputLabel id="maxDiffLabel" style={{fontSize: "14px"}}>Max Difficulty</InputLabel> 
                <Select labelId="maxDiffLabel" value={maxDiff} onChange={(event) => setMaxDiff(event.target.value)} error={maxErrorText !== ''} >
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
                    <Checkbox checked={showTrad} onChange={(event) => setShowTrad(event.target.checked)} />} label="Trad" />
                <FormControlLabel control={
                    <Checkbox checked={showTR} onChange={(event) => setShowTR(event.target.checked)} />} label="Top Rope" />
                <FormControlLabel control={
                    <Checkbox checked={showSport} onChange={(event) => setShowSport(event.target.checked)} />} label="Sport" />
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
                        Average Stars 1 - 5
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