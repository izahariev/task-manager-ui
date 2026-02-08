import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import InfoIcon from '@mui/icons-material/Info';
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
import {useActiveTab} from "../../contexts/ActiveTabContext.jsx";
import {useErrors} from "../../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../../contexts/TaskChangedMessageContext.jsx";
import {useUsers} from "../../contexts/UsersContext.jsx";
import {deleteTask, fetchTasks, updateTask} from "../../js/BackendApis.js";
import TaskPopup from "../task_popup/TaskPopup.jsx";
import RowButton from "./RowButton.jsx";

SubtaskSection.propTypes = {
    parentTaskId: PropTypes.string,
    parentTaskTitle: PropTypes.string,
    expand: PropTypes.bool.isRequired
};

function SubtaskSection(props) {
    const {
        parentTaskId,
        parentTaskTitle,
        expand
    } = props;
    const {activeTab} = useActiveTab();
    const {users, refreshUsers} = useUsers();
    const {addErrors, clearErrors} = useErrors();
    const {setTaskChangedMessage} = useTaskChangedMessage();
    const [subtasks, setSubtasks] = React.useState([]);
    const [subtaskPageCount, setSubtaskPageCount] = React.useState(0);
    const [subtaskCurrentPage, setSubtaskCurrentPage] = React.useState(1);
    const [deleteSubtaskId, setDeleteSubtaskId] = React.useState(null);
    const [deleteSubtaskTitle, setDeleteSubtaskTitle] = React.useState('');
    const [deleteSubtaskError, setDeleteSubtaskError] = React.useState(null);
    const [completeSubtaskId, setCompleteSubtaskId] = React.useState(null);
    const [completeSubtaskError, setCompleteSubtaskError] = React.useState(null);
    const [completeSubtaskTitle, setCompleteSubtaskTitle] = React.useState('');
    const [openAddSubtaskPopup, setOpenAddSubtaskPopup] = React.useState(false);
    const [viewSubtaskPopup, setViewSubtaskPopup] = React.useState(false);
    const [selectedSubtaskId, setSelectedSubtaskId] = React.useState(null);
    const [subtaskReadOnly, setSubtaskReadOnly] = React.useState(true);
    const [subtaskTypePending, setSubtaskTypePending] = React.useState(null);
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);

    const refreshSubtasks = ({
                                 priority = null, title = null, startDate = null, deadline = null,
                                 completionDate = null, assignees = null, pendingOverride = null,
                                 page = subtaskCurrentPage
                             } = {}) => {

        let isCompleted;
        if (activeTab === "completed") {
            isCompleted = null;
        } else if (pendingOverride !== null) {
            // pendingOverride is true for pending, false for completed
            isCompleted = !pendingOverride;
        } else {
            // Use current state: subtaskTypePending is true for pending, false for completed, null means pending
            isCompleted = subtaskTypePending === null ? false : !subtaskTypePending;
        }
        fetchTasks(parentTaskId, priority, title, startDate, deadline, completionDate, isCompleted, assignees,
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

    React.useEffect(() => {
        if (expand) {
            fetchTasks(parentTaskId, null, null, null, null, null,
              false, null, 1, 5)
              .then(r => {
                  if (r.errors.length > 0) {
                      addErrors(r.errors);
                  } else {
                      setSubtasks(r.content.elements);
                      setSubtaskPageCount(r.content.totalPageCount);
                      setSubtaskCurrentPage(1);
                  }
              }).catch(error => {
                const errors = []
                error.response.data['errors'].forEach((error) => {
                    errors.push(error['description']);
                })
                addErrors(errors);
            });
            setSubtaskTypePending(null);
        } else {
            setFilterEnabled(false);
            setPriorityFilterValue("");
            setTitleFilterValue("");
            setDeadlineDateFilterValue(null);
            setAssigneesFilterValues([]);
        }
    }, [expand])

    const handleDeleteSubtaskClick = () => {
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
                  setTaskChangedMessage(`Subtask "${deleteSubtaskTitle}" deleted`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while deleting the subtask';
              setDeleteSubtaskError(errorMessage);
          });
    };

    const handleCompleteSubtaskClick = () => {
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
                  setTaskChangedMessage(`Subtask "${completeSubtaskTitle}" completed`);
              }
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while completing the subtask';
              setCompleteSubtaskError(errorMessage);
          });
    };

    return (
      <React.Fragment>
          <Collapse in={expand} timeout="auto" unmountOnExit>
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
                      <RowButton
                        backgroundColor="#5B7FA6"
                        hoverBackgroundColor="#4A6B8F"
                        onClick={() => {
                            setOpenAddSubtaskPopup(true);
                        }}
                        icon={<AddIcon sx={{color: "white"}} fontSize={"small"}/>}
                      />
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
                                          setFilterEnabled(!filterEnabled);
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
                                    <Box sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <FormControl size="small" sx={{flex: 1}}>
                                            <InputLabel id="subtask-priority-select-label">Priority</InputLabel>
                                            <Select
                                              labelId="subtask-priority-select-label"
                                              id="subtask-priority-select"
                                              value={priorityFilterValue}
                                              onChange={event => {
                                                  setPriorityFilterValue(event.target.value);
                                              }}
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
                                              <CloseIcon fontSize="small"/>
                                          </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{py: 1.5}}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <TextField
                                          id="subtask-title-filter"
                                          variant="outlined"
                                          fullWidth
                                          multiline
                                          minRows={1}
                                          maxRows={5}
                                          size="small"
                                          value={titleFilterValue}
                                          onChange={event =>
                                            setTitleFilterValue(event.target.value)}
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
                                              <CloseIcon fontSize="small"/>
                                          </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{minWidth: '21%', py: 1.5}}>
                                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                              value={deadlineDateFilterValue}
                                              onChange={newValue =>
                                                setDeadlineDateFilterValue(newValue)}
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
                                        <Tooltip
                                          title="Filters the subtasks which have deadline greater or equal to the specified"
                                          arrow>
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
                                              <CloseIcon fontSize="small"/>
                                          </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                                <TableCell sx={{minWidth: '15%', py: 1.5}}>
                                    <Box sx={{
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}>
                                        <FormControl size="small" sx={{flex: 1}}>
                                            <InputLabel
                                              id="subtask-assignees-checkbox-label">Assignees</InputLabel>
                                            <Select
                                              labelId="subtask-assignees-checkbox-label"
                                              id="subtask-assignees-checkbox"
                                              multiple
                                              value={assigneesFilterValues}
                                              onChange={event => {
                                                  const {
                                                      target: {value},
                                                  } = event;
                                                  setAssigneesFilterValues(
                                                    typeof value === 'string' ? value.split(',') : value,
                                                  );
                                              }}
                                              input={<OutlinedInput label="Assignees"/>}
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
                                                      const aSelected = assigneesFilterValues.includes(a.name);
                                                      const bSelected = assigneesFilterValues.includes(b.name);
                                                      if (aSelected && !bSelected) return -1;
                                                      if (!aSelected && bSelected) return 1;
                                                      return String(a.name).localeCompare(String(b.name));
                                                  }).map((user) => (
                                                    <MenuItem key={user.id} value={user.name}>
                                                        <Checkbox
                                                          checked={assigneesFilterValues.includes(user.name)}
                                                          sx={{
                                                              color: '#5B7FA6',
                                                              '&.Mui-checked': {
                                                                  color: '#5B7FA6',
                                                              }
                                                          }}
                                                        />
                                                        <ListItemText primary={user.name}/>
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
                                              <CloseIcon fontSize="small"/>
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
                                      <RowButton
                                        backgroundColor="#4CAF50"
                                        hoverBackgroundColor="#45a049"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCompleteSubtaskId(subtaskRow.id);
                                            setCompleteSubtaskTitle(subtaskRow.title);
                                            setCompleteSubtaskError(null);
                                        }}
                                        icon={<CheckIcon sx={{color: "white"}} fontSize={"small"}/>}
                                      />
                                    )}
                                    {activeTab !== "completed" && (subtaskTypePending || subtaskTypePending === null) && (
                                      <RowButton
                                        backgroundColor="#2196F3"
                                        hoverBackgroundColor="#1976D2"
                                        marginLeft="1%"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedSubtaskId(subtaskRow.id);
                                            setSubtaskReadOnly(false);
                                            setViewSubtaskPopup(true);
                                        }}
                                        icon={<EditIcon sx={{color: "white"}} fontSize={"small"}/>}
                                      />
                                    )}
                                    <RowButton
                                      backgroundColor="#F44336"
                                      hoverBackgroundColor="#D32F2F"
                                      marginLeft="1%"
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteSubtaskId(subtaskRow.id);
                                          setDeleteSubtaskTitle(subtaskRow.title);
                                          setDeleteSubtaskError(null);
                                      }}
                                      icon={<DeleteIcon sx={{color: "white"}} fontSize={"small"}/>}
                                    />
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
          {openAddSubtaskPopup &&
            <TaskPopup
              open={openAddSubtaskPopup}
              setOpen={setOpenAddSubtaskPopup}
              setSubtasks={setSubtasks}
              parentTaskId={parentTaskId}
              parentTask={parentTaskTitle}
              refreshSubtasks={refreshSubtasks}
            />
          }
          {viewSubtaskPopup &&
            <TaskPopup
              open={viewSubtaskPopup}
              setOpen={setViewSubtaskPopup}
              taskId={selectedSubtaskId}
              parentTaskId={parentTaskId}
              parentTask={parentTaskTitle}
              customReadOnly={subtaskReadOnly}
              refreshSubtasks={refreshSubtasks}
            />
          }
      </React.Fragment>
    );
}

export default SubtaskSection;
