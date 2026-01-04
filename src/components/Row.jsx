import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Box, Collapse, IconButton} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
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
    setTasks: PropTypes.func,
    setTaskChanged: PropTypes.func,
    setErrorMessages: PropTypes.func
};

function Row(props) {
    const {row, index, users, setTasks, setTaskChanged, setErrorMessages} = props;
    const [open, setOpen] = React.useState(false);
    const [viewTaskPopup, setViewTaskPopup] = React.useState(false);
    const [openAddSubtaskPopup, setOpenAddSubtaskPopup] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(true);
    const [subtasks, setSubtasks] = React.useState([]);

    React.useEffect(() => {
        if (open === false) {
            setReadOnly(true);
        }
    }, [open, readOnly])

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
                                          setErrorMessages([...r.errors]);
                                      } else {
                                          setSubtasks(r.content.elements)
                                      }
                                  })
                                  .catch(error => {
                                      const errors = []
                                      error.response.data['errors'].forEach((error) => {
                                          errors.push(error['description']);
                                      })
                                      setErrorMessages([...errors]);
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
                                  setErrorMessages([...r.errors]);
                              } else {
                                  fetchTasks(null, null, null, null, false,
                                    null, 1, 10).then(r => {
                                      if (r.errors.length > 0) {
                                          setErrorMessages([...r.errors]);
                                      } else {
                                          setTasks(r.content.elements)
                                          setErrorMessages([]);
                                          setOpen(false);
                                          setTaskChanged(`Task "${row.title}" completed`);
                                      }
                                  })
                              }
                          }
                        )
                        .catch(error => {
                              const errors = []
                              error.response.data['errors'].forEach((error) => {
                                  errors.push(error['description']);
                              })
                              setErrorMessages([...errors]);
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
                                      <TableCell/>
                                  </TableRow>
                              </TableHead>
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