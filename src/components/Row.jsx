import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReplayIcon from '@mui/icons-material/Replay';
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
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip
} from "@mui/material";
import Button from "@mui/material/Button";
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
        completionDate: PropTypes.string,
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
    const [completeTaskId, setCompleteTaskId] = React.useState(null);
    const [completeTaskError, setCompleteTaskError] = React.useState(null);
    const [completeSubtaskId, setCompleteSubtaskId] = React.useState(null);
    const [completeSubtaskError, setCompleteSubtaskError] = React.useState(null);
    const [completeSubtaskTitle, setCompleteSubtaskTitle] = React.useState('');
    const [rollbackTaskId, setRollbackTaskId] = React.useState(null);
    const [rollbackTaskError, setRollbackTaskError] = React.useState(null);
    const [subtaskTypePending, setSubtaskTypePending] = React.useState(null);

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

    const refreshSubtasks = ({
                                 priority = null, title = null, startDate = null, deadline = null,
                                 completionDate = null, assignees = null, pendingOverride = null,
                                 page = subtaskCurrentPage
                             } = {}) => {

        let isCompleted = null;
        if (activeTab === "completed") {
            isCompleted = null;
        } else if (pendingOverride !== null) {
            // pendingOverride is true for pending, false for completed
            isCompleted = !pendingOverride;
        } else {
            // Use current state: subtaskTypePending is true for pending, false for completed, null means pending
            isCompleted = subtaskTypePending === null ? false : !subtaskTypePending;
        }
        fetchTasks(row.id, priority, title, startDate, deadline, completionDate, isCompleted, assignees,
          page, 5)
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
                      refreshSubtasks({
                          priority: priorityFilterValue || null,
                          title: titleFilterValue || null,
                          startDate: null,
                          deadline: deadlineDateFilterValue || null,
                          completionDate: null,
                          assignees: assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                          page: subtaskCurrentPage
                      });
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

    const handleCompleteTaskClick = () => {
        updateTask(completeTaskId, {"isCompleted": true})
          .then(r => {
              if (r.errors && r.errors.length > 0) {
                  setCompleteTaskError(r.errors.join(', '));
              } else {
                  setCompleteTaskId(null);
                  setCompleteTaskError(null);
                  refreshTasks();
                  setOpen(false);
                  setTaskChangedMessage(`Task "${row.title}" completed`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while completing the task';
              setCompleteTaskError(errorMessage);
          });
    };

    const handleCompleteSubtaskClick = () => {
        const subtaskTitleToComplete = completeSubtaskTitle;
        updateTask(completeSubtaskId, {"isCompleted": true})
          .then(r => {
              if (r.errors && r.errors.length > 0) {
                  setCompleteSubtaskError(r.errors.join(', '));
              } else {
                  setCompleteSubtaskId(null);
                  setCompleteSubtaskError(null);
                  setCompleteSubtaskTitle('');
                  if (filterEnabled) {
                      refreshSubtasks({
                          priority: priorityFilterValue || null,
                          title: titleFilterValue || null,
                          startDate: null,
                          deadline: deadlineDateFilterValue || null,
                          completionDate: null,
                          assignees: assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                          page: subtaskCurrentPage
                      });
                  } else {
                      refreshSubtasks({page: subtaskCurrentPage});
                  }
                  setTaskChangedMessage(`Subtask "${subtaskTitleToComplete}" completed`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while completing the subtask';
              setCompleteSubtaskError(errorMessage);
          });
    };

    const handleRollbackTaskClick = () => {
        updateTask(rollbackTaskId, {"isCompleted": false})
          .then(r => {
              if (r.errors && r.errors.length > 0) {
                  setRollbackTaskError(r.errors.join(', '));
              } else {
                  setRollbackTaskId(null);
                  setRollbackTaskError(null);
                  refreshTasks();
                  setOpen(false);
                  setTaskChangedMessage(`Task "${row.title}" rolled back`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while rolling back the task';
              setRollbackTaskError(errorMessage);
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
                            } else {
                                setSubtaskTypePending(null);
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
              {activeTab === "completed" && (
                <TableCell onClick={(e) => {
                    if (open) {
                        setOpen(false);
                    } else {
                        e.stopPropagation();
                        setReadOnly(true);
                        setViewTaskPopup(true);
                    }
                }}>{row.completionDate}</TableCell>
              )}
              {activeTab !== "active" && activeTab !== "completed" && (
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
                  {activeTab !== "completed" && (
                     <IconButton sx={{
                         backgroundColor: "#4CAF50",
                         '&:hover': {
                             backgroundColor: '#45a049',
                         },
                         transition: 'background-color 0.2s ease'
                     }} size={"small"} onClick={(e) => {
                         e.stopPropagation();
                         setCompleteTaskId(row.id);
                         setCompleteTaskError(null);
                     }}>
                         <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                     </IconButton>
                  )}
                  {activeTab !== "completed" && (
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
                  )}
                  {activeTab === "completed" && (
                    <IconButton sx={{
                        backgroundColor: "#FF9800",
                        marginLeft: "1%",
                        '&:hover': {
                            backgroundColor: '#F57C00',
                        },
                        transition: 'background-color 0.2s ease'
                    }} size={"small"}
                    onClick={(e) => {
                        e.stopPropagation();
                        setRollbackTaskId(row.id);
                        setRollbackTaskError(null);
                    }}>
                        <ReplayIcon sx={{color: "white"}} fontSize={"small"}/>
                    </IconButton>
                  )}
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
              <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={activeTab === "active" ? 7 : 8}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box sx={{margin: 1}}>
                          <Box sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              marginBottom: 2,
                              position: 'relative'
                          }}>
                              <Typography variant="h6" component="div">
                                  Subtasks
                              </Typography>
                              {activeTab !== "completed" && (
                                <Box sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}>
                                    <ToggleButtonGroup
                                      value={subtaskTypePending || subtaskTypePending == null ? 'active' : 'completed'}
                                      exclusive
                                      onChange={(event, newValue) => {
                                          if (newValue !== null) {
                                              const newIsPending = newValue === "active";
                                              setSubtaskTypePending(newIsPending);
                                              setSubtaskCurrentPage(1);
                                              if (filterEnabled) {
                                                  refreshSubtasks({
                                                      priority: priorityFilterValue || null,
                                                      title: titleFilterValue || null,
                                                      startDate: null,
                                                      deadline: deadlineDateFilterValue || null,
                                                      completionDate: null,
                                                      assignees: assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                                                      pendingOverride: newIsPending,
                                                      page: 1
                                                  });
                                              } else {
                                                  refreshSubtasks({
                                                      page: 1,
                                                      pendingOverride: newIsPending
                                                  });
                                              }
                                          }
                                      }}
                                      size="small"
                                      sx={{
                                          '& .MuiToggleButton-root': {
                                              color: '#2D3748',
                                              borderColor: '#CBD5E0',
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
                                    >
                                        <ToggleButton value="active">
                                            Pending subtasks
                                        </ToggleButton>
                                        <ToggleButton value="completed">
                                            Completed subtasks
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                              )}
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
                                        backgroundColor: '#F7FAFC',
                                        borderBottom: '2px solid #E2E8F0',
                                        '& .MuiTableCell-head': {
                                            padding: '16px 8px',
                                            borderBottom: 'none'
                                        }
                                    }}>
                                        <TableCell sx={{minWidth: '10%', py: 1.5}}>
                                            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FormControl size="small" sx={{ flex: 1 }}>
                                                    <InputLabel id="subtask-priority-select-label">Priority</InputLabel>
                                                    <Select
                                                      labelId="subtask-priority-select-label"
                                                      id="subtask-priority-select"
                                                      value={priorityFilterValue}
                                                      onChange={handlePriorityFilterValueChange}
                                                      label="Priority"
                                                      sx={{
                                                          backgroundColor: '#FFFFFF',
                                                          '& .MuiOutlinedInput-notchedOutline': {
                                                              borderColor: '#CBD5E0'
                                                          },
                                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                                              borderColor: '#5B7FA6'
                                                          }
                                                      }}
                                                    >
                                                        <MenuItem value="">All</MenuItem>
                                                        <MenuItem value="P0">P0</MenuItem>
                                                        <MenuItem value="P1">P1</MenuItem>
                                                        <MenuItem value="P2">P2</MenuItem>
                                                        <MenuItem value="P3">P3</MenuItem>
                                                        <MenuItem value="P4">P4</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                {priorityFilterValue && (
                                                    <IconButton
                                                      size="small"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setPriorityFilterValue("");
                                                      }}
                                                      sx={{
                                                          color: '#718096',
                                                          flexShrink: 0,
                                                          backgroundColor: '#F7FAFC',
                                                          '&:hover': {
                                                              color: '#2D3748',
                                                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                          }
                                                      }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{py: 1.5}}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <TextField
                                                  id="subtask-title-filter"
                                                  variant="outlined"
                                                  fullWidth
                                                  multiline
                                                  minRows={1}
                                                  maxRows={5}
                                                  size="small"
                                                  value={titleFilterValue}
                                                  onChange={handleTitleFilterValueChange}
                                                  placeholder="Search by title..."
                                                  sx={{
                                                      backgroundColor: '#FFFFFF',
                                                      flex: 1,
                                                      '& .MuiOutlinedInput-root': {
                                                          '& fieldset': {
                                                              borderColor: '#CBD5E0'
                                                          },
                                                          '&:hover fieldset': {
                                                              borderColor: '#5B7FA6'
                                                          },
                                                          '&.Mui-focused fieldset': {
                                                              borderColor: '#5B7FA6'
                                                          }
                                                      }
                                                  }}
                                                />
                                                {titleFilterValue && (
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => setTitleFilterValue("")}
                                                      sx={{
                                                          marginLeft: 1,
                                                          color: '#718096',
                                                          backgroundColor: '#F7FAFC',
                                                          '&:hover': {
                                                              color: '#2D3748',
                                                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                          }
                                                      }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{minWidth: '21%', py: 1.5}}>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DatePicker
                                                      value={deadlineDateFilterValue}
                                                      onChange={handleDateFilterChange}
                                                      slotProps={{
                                                          textField: {
                                                              size: 'small',
                                                              fullWidth: true,
                                                              sx: {
                                                                  backgroundColor: '#FFFFFF',
                                                                  flex: 1,
                                                                  '& .MuiOutlinedInput-root': {
                                                                      '& fieldset': {
                                                                          borderColor: '#CBD5E0'
                                                                      },
                                                                      '&:hover fieldset': {
                                                                          borderColor: '#5B7FA6'
                                                                      }
                                                                  }
                                                              }
                                                          }
                                                      }}
                                                    />
                                                </LocalizationProvider>
                                                <Tooltip title="Filters the subtasks which have deadline greater or equal to the specified" arrow>
                                                    <InfoIcon 
                                                      sx={{ 
                                                          marginLeft: 1,
                                                          color: '#718096',
                                                          fontSize: '1.2rem'
                                                      }} 
                                                    />
                                                </Tooltip>
                                                {deadlineDateFilterValue && (
                                                    <IconButton
                                                      size="small"
                                                      onClick={() => setDeadlineDateFilterValue(null)}
                                                      sx={{
                                                          marginLeft: 1,
                                                          color: '#718096',
                                                          backgroundColor: '#F7FAFC',
                                                          '&:hover': {
                                                              color: '#2D3748',
                                                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                          }
                                                      }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{minWidth: '15%', py: 1.5}}>
                                            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FormControl size="small" sx={{ flex: 1 }}>
                                                    <InputLabel id="subtask-assignees-checkbox-label">Assignees</InputLabel>
                                                    <Select
                                                      labelId="subtask-assignees-checkbox-label"
                                                      id="subtask-assignees-checkbox"
                                                      multiple
                                                      value={assigneesFilterValues}
                                                      onChange={handleAssigneesFilterChange}
                                                      input={<OutlinedInput label="Assignees" />}
                                                      renderValue={(selected) => selected.length > 0 ? `${selected.length} selected` : 'All'}
                                                      sx={{
                                                          backgroundColor: '#FFFFFF',
                                                          '& .MuiOutlinedInput-notchedOutline': {
                                                              borderColor: '#CBD5E0'
                                                          },
                                                          '&:hover .MuiOutlinedInput-notchedOutline': {
                                                              borderColor: '#5B7FA6'
                                                          }
                                                      }}
                                                      MenuProps={{
                                                          PaperProps: {
                                                              style: {
                                                                  maxHeight: 300,
                                                              },
                                                          },
                                                      }}
                                                    >
                                                        {users && Array.isArray(users) && users.length > 0 ? (
                                                            [...users].sort((a, b) => {
                                                                const aSelected = assigneesFilterValues.includes(a);
                                                                const bSelected = assigneesFilterValues.includes(b);
                                                                if (aSelected && !bSelected) return -1;
                                                                if (!aSelected && bSelected) return 1;
                                                                return String(a).localeCompare(String(b));
                                                            }).map((name) => (
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
                                                                  <ListItemText primary={name} />
                                                              </MenuItem>
                                                            ))
                                                        ) : (
                                                            <MenuItem disabled>No users available</MenuItem>
                                                        )}
                                                    </Select>
                                                </FormControl>
                                                {assigneesFilterValues.length > 0 && (
                                                    <IconButton
                                                      size="small"
                                                      onClick={(e) => {
                                                          e.stopPropagation();
                                                          setAssigneesFilterValues([]);
                                                      }}
                                                      sx={{
                                                          color: '#718096',
                                                          flexShrink: 0,
                                                          backgroundColor: '#F7FAFC',
                                                          '&:hover': {
                                                              color: '#2D3748',
                                                              backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                                          }
                                                      }}
                                                    >
                                                        <CloseIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{minWidth: '13%', py: 1.5}}>
                                            <Button
                                              variant="outlined"
                                              onClick={() => {
                                                  setPriorityFilterValue("");
                                                  setTitleFilterValue("");
                                                  setDeadlineDateFilterValue(null);
                                                  setAssigneesFilterValues([]);
                                                  refreshSubtasks({page: subtaskCurrentPage});
                                              }}
                                              sx={{
                                                  mr: 1,
                                                  borderColor: '#CBD5E0',
                                                  color: '#4A5568',
                                                  textTransform: 'none',
                                                  '&:hover': {
                                                      borderColor: '#5B7FA6',
                                                      backgroundColor: 'rgba(91, 127, 166, 0.08)',
                                                  }
                                              }}
                                            >
                                                Clear all
                                            </Button>
                                            <Button
                                              variant="contained"
                                              onClick={() => {
                                                  refreshSubtasks({
                                                      priority: priorityFilterValue || null,
                                                      title: titleFilterValue || null,
                                                      startDate: null,
                                                      deadline: deadlineDateFilterValue || null,
                                                      completionDate: null,
                                                      assignees: assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                                                      page: 1
                                                  });
                                              }}
                                              sx={{
                                                  backgroundColor: '#5B7FA6',
                                                  textTransform: 'none',
                                                  '&:hover': {
                                                      backgroundColor: '#4A6B8F',
                                                  },
                                                  transition: 'background-color 0.2s ease'
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
                                            {activeTab !== "completed" && (subtaskTypePending || subtaskTypePending === null) && (
                                              <IconButton sx={{
                                                  backgroundColor: "#4CAF50",
                                                  '&:hover': {
                                                      backgroundColor: '#45a049',
                                                  },
                                                  transition: 'background-color 0.2s ease'
                                              }} size={"small"} onClick={(e) => {
                                                  e.stopPropagation();
                                                  setCompleteSubtaskId(subtaskRow.id);
                                                  setCompleteSubtaskTitle(subtaskRow.title);
                                                  setCompleteSubtaskError(null);
                                              }}>
                                                  <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                                              </IconButton>
                                            )}
                                            {activeTab !== "completed" && (subtaskTypePending || subtaskTypePending === null) && (
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
                                            )}
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
                                      refreshSubtasks({
                                          priority: filterEnabled ? priorityFilterValue || null : null,
                                          title: filterEnabled ? titleFilterValue || null : null,
                                          startDate: null,
                                          deadline: filterEnabled ? deadlineDateFilterValue || null : null,
                                          completionDate: null,
                                          assignees: filterEnabled && assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                                          page: page
                                      });
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
                  <DialogContentText sx={{mt: 2, fontWeight: 'bold', color: '#F44336'}}>
                      This action can not be reverted!
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
                  <DialogContentText sx={{mt: 2, fontWeight: 'bold', color: '#F44336'}}>
                      This action can not be reverted!
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
          <Dialog
            open={completeTaskId !== null}
            onClose={() => {
                setCompleteTaskId(null);
                setCompleteTaskError(null);
            }}
          >
              <DialogTitle>Complete Task</DialogTitle>
              <DialogContent>
                  {completeTaskError && (
                      <Alert severity="error" sx={{marginBottom: 2}} onClose={() => setCompleteTaskError(null)}>
                          {completeTaskError}
                      </Alert>
                  )}
                  <DialogContentText>
                      Are you sure you want to complete task <strong>"{row.title}"</strong>?
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={() => {
                        setCompleteTaskId(null);
                        setCompleteTaskError(null);
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
                    onClick={handleCompleteTaskClick}
                    sx={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#45a049',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    variant="contained"
                  >
                      Complete
                  </Button>
              </DialogActions>
          </Dialog>
          <Dialog
            open={completeSubtaskId !== null}
            onClose={() => {
                setCompleteSubtaskId(null);
                setCompleteSubtaskTitle('');
                setCompleteSubtaskError(null);
            }}
          >
              <DialogTitle>Complete Subtask</DialogTitle>
              <DialogContent>
                  {completeSubtaskError && (
                      <Alert severity="error" sx={{marginBottom: 2}} onClose={() => setCompleteSubtaskError(null)}>
                          {completeSubtaskError}
                      </Alert>
                  )}
                  <DialogContentText>
                      Are you sure you want to complete subtask <strong>"{completeSubtaskTitle}"</strong>?
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={() => {
                        setCompleteSubtaskId(null);
                        setCompleteSubtaskTitle('');
                        setCompleteSubtaskError(null);
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
                    onClick={handleCompleteSubtaskClick}
                    sx={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#45a049',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    variant="contained"
                  >
                      Complete
                  </Button>
              </DialogActions>
          </Dialog>
          <Dialog
            open={rollbackTaskId !== null}
            onClose={() => {
                setRollbackTaskId(null);
                setRollbackTaskError(null);
            }}
          >
              <DialogTitle>Rollback Task</DialogTitle>
              <DialogContent>
                  {rollbackTaskError && (
                      <Alert severity="error" sx={{marginBottom: 2}} onClose={() => setRollbackTaskError(null)}>
                          {rollbackTaskError}
                      </Alert>
                  )}
                  <DialogContentText>
                      Are you sure you want to rollback completed task <strong>"{row.title}"</strong>?
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button
                    onClick={() => {
                        setRollbackTaskId(null);
                        setRollbackTaskError(null);
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
                    onClick={handleRollbackTaskClick}
                    sx={{
                        backgroundColor: '#FF9800',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#F57C00',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    variant="contained"
                  >
                      Rollback
                  </Button>
              </DialogActions>
          </Dialog>
      </React.Fragment>
    );
}

export default Row;