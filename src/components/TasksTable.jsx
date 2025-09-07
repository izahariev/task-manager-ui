import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    TableContainer,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import React from "react";
import {fetchTasks} from "../js/BackendApis.js";
import Row from "./Row.jsx";

TasksTable.propTypes = {
    users: PropTypes.array,
    tasks: PropTypes.array,
    setTasks: PropTypes.func,
    setErrorMessages: PropTypes.func,
}

function TasksTable({users, tasks, setTasks, setErrorMessages}) {
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);

    const handlePriorityFilterValueChange = (event) => {
        setPriorityFilterValue(event.target.value);
    };

    const handleTitleFilterValueChange = (event) => {
        setTitleFilterValue(event.target.value);
    };

    const handleDateFilterChange = (newValue) => {
        setDeadlineDateFilterValue(newValue);
    };

    const handleAssigneesFilterChange = (event) => {
        const {
            target: {value},
        } = event;
        setAssigneesFilterValues(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleApplyFilterClick = () => {
        fetchTasks(priorityFilterValue, titleFilterValue, deadlineDateFilterValue, assigneesFilterValues, 1, 10)
          .then(r => {
              setErrorMessages([]);
              setTasks(r)
          }).catch(error => {
            const errors = []
            error.response.data['errors'].forEach((error) => {
                errors.push(error['description']);
            })
            setErrorMessages([...errors]);
        });
    }

    return (
      <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
              <TableHead>
                  <TableRow sx={{backgroundColor: '#8C8C8C'}}>
                      <TableCell sx={{width: "1%"}}/>
                      <TableCell>Priority</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Assignees</TableCell>
                      <TableCell align={"right"} sx={{minWidth: '7%'}}>
                          {!filterEnabled && <FilterListIcon onClick={() => setFilterEnabled(!filterEnabled)}/>}
                          {filterEnabled && <FilterListOffIcon onClick={() => setFilterEnabled(!filterEnabled)}/>}
                      </TableCell>
                  </TableRow>
              </TableHead>
              {filterEnabled &&
                <TableHead>
                    <TableRow sx={{backgroundColor: '#8C8C8C'}}>
                        <TableCell/>
                        <TableCell sx={{minWidth: '10%'}}>
                            <Grid container spacing={0}>
                                <Grid item size={6}>
                                    <Select
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      value={priorityFilterValue}
                                      onChange={handlePriorityFilterValueChange}
                                      variant={"outlined"}
                                      size={"small"}
                                      sx={{width: '90%'}}
                                    >
                                        <MenuItem value={"P0"}>P0</MenuItem>
                                        <MenuItem value={"P1"}>P1</MenuItem>
                                        <MenuItem value={"P2"}>P2</MenuItem>
                                        <MenuItem value={"P3"}>P3</MenuItem>
                                        <MenuItem value={"P4"}>P4</MenuItem>
                                    </Select>
                                </Grid>
                                <Grid item size={6}>
                                    <Button
                                      variant="contained"
                                      sx={{marginTop: "2%"}}
                                      onClick={() => setPriorityFilterValue("")}
                                    >
                                        X
                                    </Button>
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell>
                            <Grid container spacing={1}>
                                <Grid item size={10}>
                                    <TextField
                                      id="outlined-basic"
                                      variant="outlined"
                                      fullWidth={true}
                                      size={"small"}
                                      value={titleFilterValue}
                                      onChange={handleTitleFilterValueChange}/>
                                </Grid>
                                <Grid item>
                                    <Button
                                      variant="contained"
                                      sx={{marginTop: "2%"}}
                                      onClick={() => setTitleFilterValue("")}
                                    >
                                        X
                                    </Button>
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell sx={{minWidth: '21%'}}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                          value={deadlineDateFilterValue}
                                          onChange={handleDateFilterChange}
                                          slotProps={{textField: {size: 'small'}}}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item>
                                    <Button
                                      variant="contained"
                                      sx={{marginTop: "2%"}}
                                      onClick={() => setDeadlineDateFilterValue(null)}
                                    >
                                        X
                                    </Button>
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell sx={{minWidth: '15%'}}>
                            <Grid container spacing={1}>
                                <Grid item size={8}>
                                    <FormControl fullWidth={true}>
                                        <InputLabel id="demo-multiple-checkbox-label"></InputLabel>
                                        <Select
                                          labelId="demo-multiple-checkbox-label"
                                          id="demo-multiple-checkbox"
                                          multiple
                                          value={assigneesFilterValues}
                                          onChange={handleAssigneesFilterChange}
                                          input={<OutlinedInput/>}
                                          renderValue={(selected) => selected.join(', ')}
                                          size={"small"}
                                        >
                                            {users.map((name) => (
                                              <MenuItem key={name} value={name}>
                                                  <Checkbox checked={assigneesFilterValues.includes(name)}/>
                                                  <ListItemText primary={name}/>
                                              </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Button
                                      variant="contained"
                                      sx={{marginTop: "2%"}}
                                      onClick={() => setAssigneesFilterValues([])}
                                    >
                                        X
                                    </Button>
                                </Grid>
                            </Grid>
                        </TableCell>
                        <TableCell sx={{minWidth: '13%'}}>
                            <Button
                              variant="contained"
                              onClick={() => {
                                  setPriorityFilterValue("");
                                  setTitleFilterValue("");
                                  setDeadlineDateFilterValue(null);
                                  setAssigneesFilterValues([]);
                              }}
                            >
                                Clear all
                            </Button>
                            <Button variant="contained" sx={{marginLeft: '5%'}} onClick={handleApplyFilterClick}>Apply</Button>
                        </TableCell>
                    </TableRow>
                </TableHead>}
              <TableBody>
                  {tasks.map((row, index) => (
                    <Row key={row.title} row={row} index={index}/>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
    );
}

export default TasksTable;