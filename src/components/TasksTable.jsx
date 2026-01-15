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
import React from "react";
import {useActiveTab} from "../contexts/ActiveTabContext.jsx";
import {useTasks} from "../contexts/TasksContext.jsx";
import {useUsers} from "../contexts/UsersContext.jsx";
import Row from "./Row.jsx";

function TasksTable() {
    const {tasks, refreshTasks} = useTasks();
    const {users, refreshUsers} = useUsers();
    const {activeTab} = useActiveTab();
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);

    /**
     * @typedef {{ elements: any[], totalPageCount: number, totalElementsCount: number }} Page
     */
    React.useEffect(() => {
        refreshTasks();
    }, [refreshTasks])

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
        refreshTasks(
          {
              priority: priorityFilterValue,
              title: titleFilterValue,
              deadline: deadlineDateFilterValue,
              assignees: assigneesFilterValues
          }
        );
    }

    return (
      <TableContainer component={Paper} sx={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
          overflow: 'hidden'
      }}>
          <Table aria-label="collapsible table">
              <TableHead>
                  <TableRow sx={{
                      backgroundColor: '#2D3748',
                      '& .MuiTableCell-head': {
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.95rem'
                      }
                  }}>
                      <TableCell sx={{width: "1%"}}/>
                      <TableCell>Priority</TableCell>
                      <TableCell>Title</TableCell>
                      {activeTab !== "active" && <TableCell>Start Time</TableCell>}
                      <TableCell>Deadline</TableCell>
                      <TableCell>Assignees</TableCell>
                      <TableCell align={"right"} sx={{minWidth: '7%'}}>
                          {!filterEnabled && <FilterListIcon onClick={() => setFilterEnabled(!filterEnabled)} sx={{color: '#FFFFFF', cursor: 'pointer'}}/>}
                          {filterEnabled &&
                            <FilterListOffIcon
                              onClick={() => {
                                  setFilterEnabled(!filterEnabled);
                                  refreshTasks();
                                  refreshUsers();
                              }}
                              sx={{color: '#FFFFFF', cursor: 'pointer'}}/>
                          }
                      </TableCell>
                  </TableRow>
              </TableHead>
              {filterEnabled &&
                <TableHead>
                    <TableRow sx={{
                        backgroundColor: '#2D3748',
                        '& .MuiTableCell-head': {
                            color: '#FFFFFF',
                            fontWeight: 600
                        }
                    }}>
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
                                      sx={{width: '90%', backgroundColor: '#FFFFFF'}}
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
                                      sx={{
                                          marginTop: "2%",
                                          backgroundColor: '#5B7FA6',
                                          '&:hover': {
                                              backgroundColor: '#4A6B8F',
                                          },
                                          transition: 'background-color 0.2s ease'
                                      }}
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
                                      onChange={handleTitleFilterValueChange}
                                      sx={{backgroundColor: '#FFFFFF'}}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                      variant="contained"
                                      sx={{
                                          marginTop: "2%",
                                          backgroundColor: '#5B7FA6',
                                          '&:hover': {
                                              backgroundColor: '#4A6B8F',
                                          },
                                          transition: 'background-color 0.2s ease'
                                      }}
                                      onClick={() => setTitleFilterValue("")}
                                    >
                                        X
                                    </Button>
                                </Grid>
                            </Grid>
                        </TableCell>
                        {activeTab !== "active" && <TableCell/>}
                        <TableCell sx={{minWidth: '21%'}}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                          value={deadlineDateFilterValue}
                                          onChange={handleDateFilterChange}
                                          slotProps={{textField: {size: 'small'}}}
                                          sx={{backgroundColor: '#FFFFFF'}}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item>
                                    <Button
                                      variant="contained"
                                      sx={{
                                          marginTop: "2%",
                                          backgroundColor: '#5B7FA6',
                                          '&:hover': {
                                              backgroundColor: '#4A6B8F',
                                          },
                                          transition: 'background-color 0.2s ease'
                                      }}
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
                                          variant="outlined"
                                          onChange={handleAssigneesFilterChange}
                                          input={<OutlinedInput/>}
                                          renderValue={(selected) => selected.join(', ')}
                                          size={"small"}
                                          sx={{backgroundColor: '#FFFFFF'}}
                                          MenuProps={{
                                            PaperProps: {
                                              style: {
                                                maxHeight: 300,
                                                width: 'auto',
                                              },
                                            },
                                          }}
                                        >
                                            {users.map((name) => (
                                              <MenuItem key={name} value={name}>
                                                  <Checkbox
                                                    checked={assigneesFilterValues.includes(name)}
                                                    sx={{
                                                        color: '#5B7FA6',
                                                        '&.Mui-checked': {
                                                            color: '#5B7FA6',
                                                        }
                                                    }}
                                                  />
                                                  <ListItemText primary={name}/>
                                              </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <Button
                                      variant="contained"
                                      sx={{
                                          marginTop: "2%",
                                          backgroundColor: '#5B7FA6',
                                          '&:hover': {
                                              backgroundColor: '#4A6B8F',
                                          },
                                          transition: 'background-color 0.2s ease'
                                      }}
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
                              sx={{
                                  backgroundColor: '#5B7FA6',
                                  '&:hover': {
                                      backgroundColor: '#4A6B8F',
                                  },
                                  transition: 'background-color 0.2s ease'
                              }}
                              onClick={() => {
                                  setPriorityFilterValue("");
                                  setTitleFilterValue("");
                                  setDeadlineDateFilterValue(null);
                                  setAssigneesFilterValues([]);
                              }}
                            >
                                Clear all
                            </Button>
                            <Button
                              variant="contained"
                              sx={{
                                  marginLeft: '5%',
                                  backgroundColor: '#5B7FA6',
                                  '&:hover': {
                                      backgroundColor: '#4A6B8F',
                                  },
                                  transition: 'background-color 0.2s ease'
                              }}
                              onClick={handleApplyFilterClick}
                            >
                                Apply
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableHead>}
              <TableBody>
                  {tasks.map((row, index) => (
                    <Row
                      key={row.title}
                      row={row}
                      index={index}
                    />
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
    );
}

export default TasksTable;