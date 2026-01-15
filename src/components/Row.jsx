import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
    Alert,
    Box,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Pagination,
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
import {useActiveTab} from "../contexts/ActiveTabContext.jsx";
import {useErrors} from "../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../contexts/TasksContext.jsx";
import {useUsers} from "../contexts/UsersContext.jsx";
import {deleteTask, fetchTasks, updateTask} from "../js/BackendApis.js";
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
};

function Row(props) {
    const {setTasks, currentPage, refreshTasks} = useTasks();
    const {addErrors, clearErrors} = useErrors();
    const {users, refreshUsers} = useUsers();
    const {setTaskChangedMessage} = useTaskChangedMessage();
    const {activeTab} = useActiveTab();
    const {row, index} = props;
    const [open, setOpen] = React.useState(false);
    const [viewTaskPopup, setViewTaskPopup] = React.useState(false);
    const [openAddSubtaskPopup, setOpenAddSubtaskPopup] = React.useState(false);
    const [viewSubtaskPopup, setViewSubtaskPopup] = React.useState(false);
    const [selectedSubtaskId, setSelectedSubtaskId] = React.useState(null);
    const [readOnly, setReadOnly] = React.useState(true);
    const [subtaskReadOnly, setSubtaskReadOnly] = React.useState(true);
    const [subtasks, setSubtasks] = React.useState([]);
    const [subtaskCurrentPage, setSubtaskCurrentPage] = React.useState(1);
    const [subtaskPageCount, setSubtaskPageCount] = React.useState(0);
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);
    const [deleteTaskId, setDeleteTaskId] = React.useState(null);
    const [deleteTaskError, setDeleteTaskError] = React.useState(null);
    const [deleteSubtaskId, setDeleteSubtaskId] = React.useState(null);
    const [deleteSubtaskError, setDeleteSubtaskError] = React.useState(null);
    const [deleteSubtaskTitle, setDeleteSubtaskTitle] = React.useState('');

    React.useEffect(() => {
        if (open === false) {
            setFilterEnabled(false);
            setPriorityFilterValue("");
            setTitleFilterValue("");
            setDeadlineDateFilterValue(null);
            setAssigneesFilterValues([]);
            setSubtaskCurrentPage(1);
        }
    }, [open])

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

    const refreshSubtasks = (priority = null, title = null, startDate = null, deadline = null,
                             assignees = null, page = subtaskCurrentPage) => {
        fetchTasks(row.id, priority, title, startDate, deadline, false, assignees, page, 5)
          .then(r => {
              if (r.errors.length > 0) {
                  addErrors(r.errors);
              } else {
                  setSubtasks(r.content.elements);
                  setSubtaskPageCount(r.content.totalPageCount);
                  setSubtaskCurrentPage(page);
                  clearErrors();
              }
          }).catch(error => {
            const errors = []
            error.response.data['errors'].forEach((error) => {
                errors.push(error['description']);
            })
            addErrors(errors);
        });
    };

    const handleDeleteTaskClick = () => {
        deleteTask(deleteTaskId)
          .then(r => {
              if (r.errors && r.errors.length > 0) {
                  setDeleteTaskError(r.errors.join(', '));
              } else {
                  setDeleteTaskId(null);
                  setDeleteTaskError(null);
                  refreshTasks();
                  setTaskChangedMessage(`Task "${row.title}" deleted`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while deleting the task';
              setDeleteTaskError(errorMessage);
          });
    };

    const handleDeleteSubtaskClick = () => {
        const subtaskTitleToDelete = deleteSubtaskTitle;
        deleteTask(deleteSubtaskId)
          .then(r => {
              if (r.errors && r.errors.length > 0) {
                  setDeleteSubtaskError(r.errors.join(', '));
              } else {
                  setDeleteSubtaskId(null);
                  setDeleteSubtaskError(null);
                  setDeleteSubtaskTitle('');
                  if (filterEnabled) {
                      refreshSubtasks(
                          priorityFilterValue || null,
                          titleFilterValue || null,
                          deadlineDateFilterValue || null,
                          assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                          subtaskCurrentPage
                      );
                  } else {
                      refreshSubtasks({page: subtaskCurrentPage});
                  }
                  setTaskChangedMessage(`Subtask "${subtaskTitleToDelete}" deleted`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while deleting the subtask';
              setDeleteSubtaskError(errorMessage);
          });
    };

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
                                refreshSubtasks({page: subtaskCurrentPage});
                            }
                            setOpen(!open)
                        }
                    }
                  >
                      {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                  </IconButton>
              </TableCell>
              <TableCell onClick={(e) => {
                  if (open) {
                      setOpen(false);
                  } else {
                      e.stopPropagation();
                      setReadOnly(true);
                      setViewTaskPopup(true);
                  }
              }}>{row.priority}</TableCell>
              <TableCell onClick={(e) => {
                  if (open) {
                      setOpen(false);
                  } else {
                      e.stopPropagation();
                      setReadOnly(true);
                      setViewTaskPopup(true);
                  }
              }}>{row.title}</TableCell>
              {activeTab !== "active" && (
                  <TableCell onClick={(e) => {
                      if (open) {
                          setOpen(false);
                      } else {
                          e.stopPropagation();
                          setReadOnly(true);
                          setViewTaskPopup(true);
                      }
                  }}>{row.start}</TableCell>
              )}
              <TableCell onClick={(e) => {
                  if (open) {
                      setOpen(false);
                  } else {
                      e.stopPropagation();
                      setReadOnly(true);
                      setViewTaskPopup(true);
                  }
              }}>{row.deadline}</TableCell>
              <TableCell onClick={(e) => {
                  if (open) {
                      setOpen(false);
                  } else {
                      e.stopPropagation();
                      setReadOnly(true);
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
                                  setTaskChangedMessage(`Task "${row.title}" completed`);
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
                    onClick={(e) => {
                        e.stopPropagation();
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
                  }} size={"small"}
                  onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTaskId(row.id);
                      setDeleteTaskError(null);
                  }}>
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
              <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={activeTab !== "active" ? 7 : 6}>
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
                                            <FilterListIcon
                                              onClick={() => {
                                                  setFilterEnabled(!filterEnabled)
                                                  refreshUsers();
                                              }}
                                              sx={{color: '#2D3748', cursor: 'pointer'}}/>
                                          }
                                          {filterEnabled &&
                                            <FilterListOffIcon
                                              onClick={() => {
                                                  setFilterEnabled(!filterEnabled);
                                                  refreshSubtasks({page: subtaskCurrentPage});
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
                                              onClick={() => {
                                                  refreshSubtasks(priorityFilterValue, titleFilterValue,
                                                    deadlineDateFilterValue, assigneesFilterValues, 1);
                                              }}
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
                                        <TableCell onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubtaskId(subtaskRow.id);
                                            setSubtaskReadOnly(true);
                                            setViewSubtaskPopup(true);
                                        }} sx={{cursor: 'pointer'}}>{subtaskRow.priority}</TableCell>
                                        <TableCell onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubtaskId(subtaskRow.id);
                                            setSubtaskReadOnly(true);
                                            setViewSubtaskPopup(true);
                                        }} sx={{cursor: 'pointer'}}>{subtaskRow.title}</TableCell>
                                        <TableCell onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubtaskId(subtaskRow.id);
                                            setSubtaskReadOnly(true);
                                            setViewSubtaskPopup(true);
                                        }} sx={{cursor: 'pointer'}}>{subtaskRow.deadline}</TableCell>
                                        <TableCell onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubtaskId(subtaskRow.id);
                                            setSubtaskReadOnly(true);
                                            setViewSubtaskPopup(true);
                                        }} sx={{cursor: 'pointer'}}>{subtaskRow.assignees}</TableCell>
                                        <TableCell align={'right'}>
                                            <IconButton sx={{
                                                backgroundColor: "#4CAF50",
                                                '&:hover': {
                                                    backgroundColor: '#45a049',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }} size={"small"} onClick={() => {
                                                updateTask(subtaskRow.id, {"isCompleted": true})
                                                    .then(r => {
                                                        if (r.errors.length > 0) {
                                                            addErrors(r.errors);
                                                        } else {
                                                            if (filterEnabled) {
                                                                refreshSubtasks(
                                                                    priorityFilterValue || null,
                                                                    titleFilterValue || null,
                                                                    deadlineDateFilterValue || null,
                                                                    assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                                                                    subtaskCurrentPage
                                                                );
                                                            } else {
                                                                refreshSubtasks({page: subtaskCurrentPage});
                                                            }
                                                            setTaskChangedMessage(`Subtask "${subtaskRow.title}" completed`);
                                                        }
                                                    })
                                                    .catch(error => {
                                                        const errors = []
                                                        error.response.data['errors'].forEach((error) => {
                                                            errors.push(error['description']);
                                                        })
                                                        addErrors(errors);
                                                    });
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
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedSubtaskId(subtaskRow.id);
                                                  setSubtaskReadOnly(false);
                                                  setViewSubtaskPopup(true);
                                              }}
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
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeleteSubtaskId(subtaskRow.id);
                                                  setDeleteSubtaskTitle(subtaskRow.title);
                                                  setDeleteSubtaskError(null);
                                              }}
                                            >
                                                <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                          </Table>
                          {subtaskPageCount > 0 &&
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginTop: 2,
                                marginBottom: 1
                            }}>
                                <Pagination
                                  count={subtaskPageCount}
                                  page={subtaskCurrentPage}
                                  sx={{
                                      '& .MuiPaginationItem-root': {
                                          color: '#2D3748',
                                          '&.Mui-selected': {
                                              backgroundColor: '#5B7FA6',
                                              color: '#FFFFFF',
                                              '&:hover': {
                                                  backgroundColor: '#4A6B8F',
                                              }
                                          },
                                          '&:hover': {
                                              backgroundColor: '#E0E7FF',
                                          }
                                      }
                                  }}
                                  showFirstButton
                                  showLastButton
                                  onChange={(event, page) => {
                                      refreshSubtasks(
                                          filterEnabled ? priorityFilterValue || null : null,
                                          filterEnabled ? titleFilterValue || null : null,
                                          filterEnabled ? deadlineDateFilterValue || null : null,
                                          filterEnabled && assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                                          page
                                      );
                                  }}
                                />
                            </Box>
                          }
                      </Box>
                  </Collapse>
              </TableCell>
          </TableRow>
          {viewTaskPopup &&
            <TaskPopup
              open={viewTaskPopup}
              setOpen={setViewTaskPopup}
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
              setTasks={setTasks}
              setSubtasks={setSubtasks}
              parentTaskId={row.id}
              parentTask={row.title}
              refreshSubtasks={refreshSubtasks}
            />
          }
          {viewSubtaskPopup &&
            <TaskPopup
              open={viewSubtaskPopup}
              setOpen={setViewSubtaskPopup}
              taskId={selectedSubtaskId}
              parentTaskId={row.id}
              parentTask={row.title}
              customReadOnly={subtaskReadOnly}
              refreshSubtasks={refreshSubtasks}
            />
          }
          <Dialog
            open={deleteTaskId !== null}
            onClose={() => {
                setDeleteTaskId(null);
                setDeleteTaskError(null);
            }}
          >
              <DialogTitle>Delete Task</DialogTitle>
              <DialogContent>
                  {deleteTaskError && (
                      <Alert severity="error" sx={{marginBottom: 2}} onClose={() => setDeleteTaskError(null)}>
                          {deleteTaskError}
                      </Alert>
                  )}
                  <DialogContentText>
                      Are you sure you want to delete task <strong>"{row.title}"</strong>?
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={() => {
                        setDeleteTaskId(null);
                        setDeleteTaskError(null);
                    }}
                    sx={{
                        color: '#5B7FA6',
                        '&:hover': {
                            backgroundColor: '#E0E7FF',
                        }
                    }}
                  >
                      Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteTaskClick}
                    sx={{
                        backgroundColor: '#F44336',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#D32F2F',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    variant="contained"
                  >
                      Delete
                  </Button>
              </DialogActions>
          </Dialog>
          <Dialog
            open={deleteSubtaskId !== null}
            onClose={() => {
                setDeleteSubtaskId(null);
                setDeleteSubtaskTitle('');
                setDeleteSubtaskError(null);
            }}
          >
              <DialogTitle>Delete Subtask</DialogTitle>
              <DialogContent>
                  {deleteSubtaskError && (
                      <Alert severity="error" sx={{marginBottom: 2}} onClose={() => setDeleteSubtaskError(null)}>
                          {deleteSubtaskError}
                      </Alert>
                  )}
                  <DialogContentText>
                      Are you sure you want to delete subtask <strong>"{deleteSubtaskTitle}"</strong>?
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={() => {
                        setDeleteSubtaskId(null);
                        setDeleteSubtaskTitle('');
                        setDeleteSubtaskError(null);
                    }}
                    sx={{
                        color: '#5B7FA6',
                        '&:hover': {
                            backgroundColor: '#E0E7FF',
                        }
                    }}
                  >
                      Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteSubtaskClick}
                    sx={{
                        backgroundColor: '#F44336',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#D32F2F',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    variant="contained"
                  >
                      Delete
                  </Button>
              </DialogActions>
          </Dialog>
      </React.Fragment>
    );
}

export default Row;