import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Box,
    Checkbox,
    Collapse,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import React from "react";
import {useTasks} from "../contexts/TasksContext.jsx";
import {useErrors} from "../contexts/ErrorMessagesContext.jsx";
import {fetchTasks, updateTask} from "../js/BackendApis.js";
import TaskPopup from "./TaskPopup.jsx";


Row.propTypes = {
    row: PropTypes.shape({
        parentTaskId: PropTypes.string,
        id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        priority: PropTypes.string,
        start: PropTypes.string,
        deadline: PropTypes.string,
        repeat: PropTypes.string,
        assignees: PropTypes.string
    }),
    index: PropTypes.number,
    users: PropTypes.array,
    setTaskChanged: PropTypes.func,
};

function Row(props) {
    const {setTasks, currentPage, refreshTasks} = useTasks();
    const {addErrors, clearErrors} = useErrors();
    const {row, index, users, setTaskChanged} = props;
    const [open, setOpen] = React.useState(false);
    const [viewTaskPopup, setViewTaskPopup] = React.useState(false);
    const [openAddSubtaskPopup, setOpenAddSubtaskPopup] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(true);
    const [subtasks, setSubtasks] = React.useState([]);
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);

    React.useEffect(() => {
        if (open === false) {
            setReadOnly(true);
            setFilterEnabled(false);
            setPriorityFilterValue("");
            setTitleFilterValue("");
            setDeadlineDateFilterValue(null);
            setAssigneesFilterValues([]);
        }
    }, [open, readOnly])

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
        fetchTasks(row.id, priorityFilterValue, titleFilterValue, deadlineDateFilterValue, false,
          assigneesFilterValues, 1, 10)
          .then(r => {
              if (r.errors.length > 0) {
                  addErrors(r.errors);
              } else {
                  setSubtasks(r.content.elements)
                  clearErrors();
              }
          }).catch(error => {
            const errors = []
            error.response.data['errors'].forEach((error) => {
                errors.push(error['description']);
            })
            addErrors(errors);
        });
    }

    return (
      <React.Fragment>
          <TableRow sx={{
              '& > *': {borderBottom: 'unset'},
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F7FAFC',
              '&:hover': {
                  backgroundColor: '#EDF2F7',
                  transition: 'background-color 0.2s ease'
              },
              cursor: 'pointer'
          }}>
              <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={
                        () => {
                            if (!open) {
                                fetchTasks(row.id, null, null, null, false,
                                  null, 1, 10)
                                  .then(r => {
                                      if (r.errors.length > 0) {
                                          addErrors(r.errors);
                                      } else {
                                          setSubtasks(r.content.elements)
                                      }
                                  })
                                  .catch(error => {
                                      const errors = []
                                      error.response.data['errors'].forEach((error) => {
                                          errors.push(error['description']);
                                      })
                                      addErrors(errors);
                                  });
                            }
                            setOpen(!open)
                        }
                    }
                  >
                      {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                  </IconButton>
              </TableCell>
              <TableCell onClick={() => {
                  if (open) {
                      setOpen(false);
                  } else {
                      setViewTaskPopup(true);
                  }
              }}>{row.priority}</TableCell>
              <TableCell onClick={() => {
                  if (open) {
                      setOpen(false);
                  } else {
                      setViewTaskPopup(true);
                  }
              }}>{row.title}</TableCell>
              <TableCell onClick={() => {
                  if (open) {
                      setOpen(false);
                  } else {
                      setViewTaskPopup(true);
                  }
              }}>{row.deadline}</TableCell>
              <TableCell onClick={() => {
                  if (open) {
                      setOpen(false);
                  } else {
                      setViewTaskPopup(true);
                  }
              }}>
                  {row.assignees.length > 0 ?
                    row.assignees.join(", ") :
                    <span style={{fontStyle: "italic"}}>Any</span>
                  }
              </TableCell>
              <TableCell align={'right'}>
                  <IconButton sx={{
                      backgroundColor: "#4CAF50",
                      '&:hover': {
                          backgroundColor: '#45a049',
                      },
                      transition: 'background-color 0.2s ease'
                  }} size={"small"} onClick={() => {
                      updateTask(row.id, {"isCompleted": true})
                        .then(r => {
                              if (r.errors.length > 0) {
                                  addErrors(r.errors);
                              } else {
                                  refreshTasks();
                                  setOpen(false);
                                  setTaskChanged(`Task "${row.title}" completed`);
                              }
                          }
                        )
                        .catch(error => {
                              const errors = []
                              error.response.data['errors'].forEach((error) => {
                                  errors.push(error['description']);
                              })
                              addErrors(errors);
                          }
                        );
                  }}>
                      <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                  </IconButton>
                  <IconButton
                    sx={{
                        backgroundColor: "#2196F3",
                        marginLeft: "1%",
                        '&:hover': {
                            backgroundColor: '#1976D2',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    size={"small"}
                    onClick={() => {
                        setReadOnly(false);
                        setViewTaskPopup(true);
                    }}>
                      <EditIcon sx={{color: "white"}} fontSize={"small"}/>
                  </IconButton>
                  <IconButton sx={{
                      backgroundColor: "#F44336",
                      marginLeft: "1%",
                      '&:hover': {
                          backgroundColor: '#D32F2F',
                      },
                      transition: 'background-color 0.2s ease'
                  }} size={"small"}>
                      <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                  </IconButton>
              </TableCell>
          </TableRow>
          <TableRow sx={{
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F7FAFC',
              '&:hover': {
                  backgroundColor: '#EDF2F7',
                  transition: 'background-color 0.2s ease'
              }
          }}>
              <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box sx={{margin: 1}}>
                          <Box sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 2
                          }}>
                              <Typography variant="h6" component="div">
                                  Subtasks
                              </Typography>
                              <IconButton
                                sx={{
                                    backgroundColor: '#5B7FA6',
                                    '&:hover': {
                                        backgroundColor: '#4A6B8F',
                                    },
                                    transition: 'background-color 0.2s ease'
                                }}
                                size="small"
                                onClick={() => {
                                    setOpenAddSubtaskPopup(true);
                                }}
                              >
                                  <AddIcon sx={{color: "white"}} fontSize={"small"}/>
                              </IconButton>
                          </Box>
                          <Table size="small" aria-label="purchases">
                              <TableHead>
                                  <TableRow>
                                      <TableCell>Priority</TableCell>
                                      <TableCell>Title</TableCell>
                                      <TableCell>Deadline</TableCell>
                                      <TableCell>Assignees</TableCell>
                                      <TableCell align={"right"} sx={{minWidth: '7%'}}>
                                          {!filterEnabled &&
                                            <FilterListIcon onClick={() => setFilterEnabled(!filterEnabled)}
                                                            sx={{color: '#2D3748', cursor: 'pointer'}}/>}
                                          {filterEnabled &&
                                            <FilterListOffIcon
                                              onClick={() => {
                                                  setFilterEnabled(!filterEnabled);
                                                  fetchTasks(row.id, null, null, null,
                                                    false, null, 1, 10)
                                                    .then(r => {
                                                        if (r.errors.length > 0) {
                                                            addErrors(r.errors);
                                                        } else {
                                                            setSubtasks(r.content.elements)
                                                        }
                                                    })
                                                    .catch(error => {
                                                        const errors = []
                                                        error.response.data['errors'].forEach((error) => {
                                                            errors.push(error['description']);
                                                        })
                                                        addErrors(errors);
                                                    });
                                              }}
                                              sx={{color: '#2D3748', cursor: 'pointer'}}/>
                                          }
                                      </TableCell>
                                  </TableRow>
                              </TableHead>
                              {filterEnabled &&
                                <TableHead>
                                    <TableRow sx={{
                                        backgroundColor: '#FFFFFF',
                                        '& .MuiTableCell-head': {
                                            color: '#2D3748',
                                            fontWeight: 600
                                        }
                                    }}>
                                        <TableCell sx={{minWidth: '10%'}}>
                                            <Grid container spacing={0}>
                                                <Grid item size={6}>
                                                    <Select
                                                      labelId="subtask-priority-select-label"
                                                      id="subtask-priority-select"
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
                                                      id="subtask-title-filter"
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
                                                        <InputLabel id="subtask-assignees-checkbox-label"></InputLabel>
                                                        <Select
                                                          labelId="subtask-assignees-checkbox-label"
                                                          id="subtask-assignees-checkbox"
                                                          multiple
                                                          value={assigneesFilterValues}
                                                          variant="outlined"
                                                          onChange={handleAssigneesFilterChange}
                                                          input={<OutlinedInput/>}
                                                          renderValue={(selected) => selected.join(', ')}
                                                          size={"small"}
                                                          sx={{backgroundColor: '#FFFFFF'}}
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
                                  {subtasks.map((subtaskRow, subtaskIndex) => (
                                    <TableRow
                                      key={subtaskRow.title}
                                      sx={{
                                          backgroundColor: subtaskIndex % 2 === 0 ? '#FFFFFF' : '#F7FAFC',
                                          '&:hover': {
                                              backgroundColor: '#EDF2F7',
                                              transition: 'background-color 0.2s ease'
                                          }
                                      }}
                                    >
                                        <TableCell>{subtaskRow.priority}</TableCell>
                                        <TableCell>{subtaskRow.title}</TableCell>
                                        <TableCell>{subtaskRow.deadline}</TableCell>
                                        <TableCell>{subtaskRow.assignees}</TableCell>
                                        <TableCell align={'right'}>
                                            <IconButton sx={{
                                                backgroundColor: "#4CAF50",
                                                '&:hover': {
                                                    backgroundColor: '#45a049',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }} size={"small"}>
                                                <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                                            </IconButton>
                                            <IconButton
                                              sx={{
                                                  backgroundColor: "#2196F3",
                                                  marginLeft: "1%",
                                                  '&:hover': {
                                                      backgroundColor: '#1976D2',
                                                  },
                                                  transition: 'background-color 0.2s ease'
                                              }}
                                              size={"small"}
                                            >
                                                <EditIcon sx={{color: "white"}} fontSize={"small"}/>
                                            </IconButton>
                                            <IconButton
                                              sx={{
                                                  backgroundColor: "#F44336",
                                                  marginLeft: "1%",
                                                  '&:hover': {
                                                      backgroundColor: '#D32F2F',
                                                  },
                                                  transition: 'background-color 0.2s ease'
                                              }}
                                              size={"small"}
                                            >
                                                <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                      </Box>
                  </Collapse>
              </TableCell>
          </TableRow>
          {viewTaskPopup &&
            <TaskPopup
              open={viewTaskPopup}
              setOpen={setViewTaskPopup}
              users={["Any", ...users]}
              setTaskChanged={setTaskChanged}
              taskId={row.id}
              setTasks={setTasks}
              customReadOnly={readOnly}
              currentPage={currentPage}
            />
          }
          {openAddSubtaskPopup &&
            <TaskPopup
              open={openAddSubtaskPopup}
              setOpen={setOpenAddSubtaskPopup}
              users={["Any", ...users]}
              setTaskChanged={setTaskChanged}
              setTasks={setTasks}
              setSubtasks={setSubtasks}
              parentTaskId={row.id}
              parentTask={row.title}
            />
          }
      </React.Fragment>
    );
}

export default Row;