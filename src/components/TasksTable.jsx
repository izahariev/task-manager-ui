import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {
    Box,
    Checkbox,
    FormControl,
    IconButton,
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
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
    const [startTimeDateFilterValue, setStartTimeDateFilterValue] = React.useState(null);
    const [completionDateFilterValue, setCompletionDateFilterValue] = React.useState(null);

    /**
     * @typedef {{ elements: any[], totalPageCount: number, totalElementsCount: number }} Page
     */
    React.useEffect(() => {
        refreshTasks();
    }, [refreshTasks])

    React.useEffect(() => {
        if (filterEnabled) {
            refreshUsers();
        }
    }, [filterEnabled, refreshUsers])

    const handlePriorityFilterValueChange = (event) => {
        setPriorityFilterValue(event.target.value);
    };

    const handleTitleFilterValueChange = (event) => {
        setTitleFilterValue(event.target.value);
    };

    const handleDateFilterChange = (newValue) => {
        setDeadlineDateFilterValue(newValue);
    };

    const handleStartTimeFilterChange = (newValue) => {
        setStartTimeDateFilterValue(newValue);
    };

    const handleCompletionDateFilterChange = (newValue) => {
        setCompletionDateFilterValue(newValue);
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
        const filters = {
            priority: priorityFilterValue,
            title: titleFilterValue,
            startDate: startTimeDateFilterValue !== null ?
              startTimeDateFilterValue :
              activeTab === "inactive" ? dayjs() : null,
            deadline: deadlineDateFilterValue,
            completionDate: completionDateFilterValue,
            assignees: assigneesFilterValues
        };
        
        refreshTasks(filters);
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
                      {activeTab === "completed" && <TableCell>Completed Time</TableCell>}
                      {activeTab === "inactive" && <TableCell>Start Time</TableCell>}
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
                        backgroundColor: '#F7FAFC',
                        borderBottom: '2px solid #E2E8F0',
                        '& .MuiTableCell-head': {
                            padding: '16px 8px',
                            borderBottom: 'none'
                        }
                    }}>
                        <TableCell sx={{width: "1%"}}/>
                        <TableCell sx={{minWidth: '10%', py: 1.5}}>
                            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FormControl size="small" sx={{ flex: 1 }}>
                                    <InputLabel id="priority-filter-label">Priority</InputLabel>
                                    <Select
                                      labelId="priority-filter-label"
                                      id="priority-filter"
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
                            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <TextField
                                  id="title-filter"
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
                        {activeTab === "completed" &&
                          <TableCell sx={{minWidth: '21%', py: 1.5}}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker
                                        value={completionDateFilterValue}
                                        onChange={handleCompletionDateFilterChange}
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
                                  {completionDateFilterValue && (
                                    <IconButton
                                      size="small"
                                      onClick={() => setCompletionDateFilterValue(null)}
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
                        }
                        {activeTab === "inactive" &&
                            <TableCell sx={{minWidth: '21%', py: 1.5}}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                          value={startTimeDateFilterValue}
                                          onChange={handleStartTimeFilterChange}
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
                                    {startTimeDateFilterValue && (
                                        <IconButton
                                          size="small"
                                          onClick={() => setStartTimeDateFilterValue(null)}
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
                        }
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
                                    <InputLabel id="assignees-filter-label">Assignees</InputLabel>
                                    <Select
                                      labelId="assignees-filter-label"
                                      id="assignees-filter"
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
                                  setStartTimeDateFilterValue(null);
                                  setCompletionDateFilterValue(null);
                                  setAssigneesFilterValues([]);
                                  refreshTasks();
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
                              onClick={handleApplyFilterClick}
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