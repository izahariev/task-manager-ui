import CloseIcon from "@mui/icons-material/Close";
import {Alert, AppBar, Dialog, IconButton, Slide, TextField, Toolbar} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import {addTask, fetchAllTasks, fetchTask, fetchTasks, updateTask} from "../js/BackendApis.js";
import AssigneesSection from "./task_popup/AssigneesSection.jsx";
import PrioritySection from "./task_popup/PrioritySection.jsx";
import TimeSection from "./task_popup/TimeSection.jsx";

TaskPopup.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    parentTaskId: PropTypes.string,
    parentTask: PropTypes.string,
    users: PropTypes.array,
    setTaskChanged: PropTypes.func,
    taskId: PropTypes.string,
    setTasks: PropTypes.func,
    customReadOnly: PropTypes.bool,
}

const Transition = React.forwardRef(
  function Transition(props, ref) {
      const {children, ...other} = props;
      return (
        <Slide direction="up" ref={ref} {...other}>
            {children}
        </Slide>
      );
  }
);

Transition.propTypes = {
    children: PropTypes.element
}

export default function TaskPopup(props) {
    const {
        open,
        setOpen,
        parentTaskId,
        parentTask,
        users,
        setTaskChanged,
        taskId,
        setTasks,
        customReadOnly
    } = props;
    const [currentTask, setCurrentTask] = React.useState({
        parentTaskId: parentTaskId,
        title: "",
        description: "",
        priority: "P3",
        startTime: dayjs().format('YYYY-MM-DD').toString(),
        deadline: "",
        repeat: "",
        assignees: []
    });
    const [initialTask, setInitialTask] = React.useState(null)
    const [readOnly, setReadOnly] = React.useState(false)
    const [isEdit, setIsEdit] = React.useState(false)
    const [errorMessages, setErrorMessages] = React.useState([]);

    React.useEffect(() => {
        if (taskId !== undefined) {
            fetchTask(taskId)
              .then(r => {
                  if (r.errors.length > 0) {
                      setErrorMessages([...r.errors]);
                  } else {
                      const task = r.content
                      setCurrentTask({
                          title: task.title,
                          description: task.description,
                          priority: task.priority,
                          startTime: task.start,
                          deadline: task.deadline,
                          repeat: task.repeat,
                          assignees: [...task.assignees]
                      })
                      setInitialTask(
                        {
                            title: task.title,
                            description: task.description,
                            priority: task.priority,
                            startTime: task.start,
                            deadline: task.deadline,
                            repeat: task.repeat,
                            assignees: [...task.assignees]
                        }
                      )
                      if (customReadOnly !== undefined) {
                          setReadOnly(customReadOnly)
                      } else {
                          setReadOnly(true)
                      }
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
    }, [customReadOnly, taskId])

    const handleSaveClick = () => {
        const errors = [];
        if (currentTask.title.trim() === '') {
            errors.push('Missing title');
        }

        if (errors.length !== 0) {
            setErrorMessages(errors);
            return;
        }

        if (initialTask === null) {
            addTask(currentTask)
              .then(r => {
                  if (r.errors.length > 0) {
                      setErrorMessages([...r.errors]);
                  } else {
                      if (parentTaskId == null) {
                          fetchTasks(null, null, null, null, false,
                            null, 1, 10)
                            .then(r => {
                                if (r.errors.length > 0) {
                                    setErrorMessages([...r.errors]);
                                } else {
                                    setTasks(r.content.elements)
                                    setErrorMessages([]);
                                    setTaskChanged(`Task "${currentTask.title}" created`);
                                }
                            })
                            .catch(error => {
                                const errors = []
                                error.response.data['errors'].forEach((error) => {
                                    errors.push(error['description']);
                                })
                                setErrorMessages([...errors]);
                            });
                      } else {
                          setErrorMessages([]);
                          setTaskChanged(`Subtask "${currentTask.title}" for task "${parentTask}" created`);
                      }
                      setOpen(false);
                  }
              }).catch(error => {
                const errors = []
                error.response.data['errors'].forEach((error) => {
                    errors.push(error['description']);
                })
                setErrorMessages([...errors]);
            });
            if (errors.length !== 0) {
                setErrorMessages(errors);
            } else {
                setErrorMessages([]);
            }
        } else {
            const updatedFields = diffTasks(currentTask, initialTask)
            if (Object.keys(updatedFields).length > 0) {
                updateTask(taskId, updatedFields)
                  .then(r => {
                        if (r.errors.length > 0) {
                            setErrorMessages([...r.errors]);
                        } else {
                            fetchAllTasks(1, 10).then(r => {
                                setTasks(r.content.elements)
                                setErrorMessages([]);
                                setOpen(false);
                                setTaskChanged({title: currentTask.title, change: "updated"});
                            }).catch(error => {
                                  const errors = []
                                  error.response.data['errors'].forEach((error) => {
                                      errors.push(error['description']);
                                  })
                                  setErrorMessages([...errors]);
                              }
                            )
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
                if (errors.length !== 0) {
                    setErrorMessages(errors);
                } else {
                    setErrorMessages([]);
                }
            } else {
                setErrorMessages([...errors, "Nothing was updated"]);
            }
        }
    }

    function diffTasks(currentTask, initialTask) {
        const diffs = {};

        for (const key of Object.keys(currentTask)) {
            if (currentTask[key] !== initialTask[key]) {
                if (currentTask[key] === "" || currentTask[key].length === 0) {
                    diffs[key] = null;
                } else {
                    diffs[key] = currentTask[key];
                }
            }
        }

        return diffs;
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
      <React.Fragment>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            slots={{
                transition: Transition
            }}
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: '#F7FAFC'
                    }
                }
            }}
          >
              <AppBar sx={{
                  position: 'relative',
                  backgroundColor: '#2D3748'
              }}>
                  <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                      >
                          <CloseIcon/>
                      </IconButton>
                      <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                          {readOnly ? 'Task Details' : isEdit ? 'Edit Task' : 'Add Task'}
                      </Typography>
                      {!readOnly && (
                        <Button color="inherit" onClick={handleSaveClick}>
                            save
                        </Button>
                      )}
                      {readOnly && (
                        <div>
                            <Button color="inherit" onClick={() => {
                                updateTask(taskId, {"isCompleted": true})
                                  .then(r => {
                                        if (r.errors.length > 0) {
                                            setErrorMessages([...r.errors]);
                                        } else {
                                            fetchAllTasks(1, 10).then(r => {
                                                if (r.errors.length > 0) {
                                                    setErrorMessages([...r.errors]);
                                                } else {
                                                    setTasks(r.content.elements)
                                                    setErrorMessages([]);
                                                    setOpen(false);
                                                    setTaskChanged({title: currentTask.title, change: "updated"});
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
                                  )
                            }}>
                                complete
                            </Button>
                            <Button color="inherit" onClick={() => {
                                setReadOnly(false)
                                setIsEdit(true)
                            }}>
                                edit
                            </Button>
                        </div>
                      )}
                  </Toolbar>
              </AppBar>
              <List>
                  {errorMessages.length !== 0 &&
                    <Alert variant="filled" severity="error" onClose={() => setErrorMessages([])}>
                        <Grid container>
                            <Grid size={12} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    <ul style={{flexGrow: '0', listStyleType: 'none'}}>
                                        {errorMessages && errorMessages.map((errorMessage, index) => (
                                          <li key={index}>
                                              {errorMessage}
                                          </li>
                                        ))}
                                    </ul>
                                </div>
                            </Grid>
                        </Grid>
                    </Alert>
                  }
                  <Grid container sx={{marginBottom: "2%"}}>
                      {parentTask &&
                        <>
                            <Grid size={12} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: "1%"
                            }}>
                                <h2>Parent task</h2>
                            </Grid>
                            <Grid size={12} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                marginBottom: "1%"
                            }}>
                                <h2 style={{color: '#7C3AED'}}>{parentTask}</h2>
                            </Grid>
                        </>
                      }
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <h2>Title</h2>
                      </Grid>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <TextField
                            value={currentTask.title}
                            onChange={(e) => {
                                // setTitle(e.target.value)
                                setCurrentTask(currentTask => ({...currentTask, title: e.target.value}));
                            }}
                            {...(readOnly ? {disabled: true} : {})}
                            sx={{width: "96%", margin: "0 2%"}}
                            size={"small"}
                          />
                      </Grid>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <h2>Description</h2>
                      </Grid>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <TextField
                            value={currentTask.description}
                            {...(readOnly ? {disabled: true} : {})}
                            multiline={true}
                            rows={3}
                            onChange={(e) => {
                                setCurrentTask(currentTask => (
                                  {
                                      ...currentTask,
                                      description: e.target.value
                                  }
                                ));
                            }}
                            sx={{width: "96%", margin: "0, 2%"}} size={"small"}/>
                      </Grid>
                      <Grid size={3} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <PrioritySection
                            priority={currentTask.priority}
                            setPriority={(p) =>
                              setCurrentTask((currentTask) => ({...currentTask, priority: p}))}
                            readOnly={readOnly}
                          />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection
                            title={"Start time"}
                            readOnly={readOnly}
                            timeValue={currentTask.startTime}
                            setTimeValue={(t) =>
                              setCurrentTask((currentTask) => ({...currentTask, startTime: t}))}
                            tooltipContent={
                                <div>
                                    The time from which the task can be completed and will appear in the active
                                    tasks table.
                                    <br/><br/>
                                    If date is selected the task will appear on the given date
                                    <br/><br/>
                                    If period is provided the task will appear after the given period have passed
                                    from now
                                </div>
                            }
                          />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection
                            title={"Deadline"}
                            readOnly={readOnly}
                            timeValue={currentTask.deadline}
                            setTimeValue={(t) =>
                              setCurrentTask((currentTask) => ({...currentTask, deadline: t}))}
                            tooltipContent={
                                <div>
                                    The time at which the task must be completed. If provided the task priority will
                                    escalate the closer it gets to the deadline, eventually reaching P0 at the day of
                                    the deadline and staying that way until completed or the task is edited.
                                </div>
                            }
                          />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection
                            title={"Repeat"}
                            readOnly={readOnly}
                            timeValue={currentTask.repeat}
                            setTimeValue={(t) =>
                              setCurrentTask((currentTask) => ({...currentTask, repeat: t}))}
                            tooltipContent={
                                <div>
                                    The time at which the task task will repeat and appear again in the active tasks
                                    table. If deadline is provided, when the task reappears the deadline will be after
                                    the same period as the period from the initial start time to the initial
                                    deadline. The task will keep repeating until cancelled. Repeat can be cancelled on
                                    each completion, by deleting the active task or by deleting the task while inactive.
                                    <br/><br/>
                                    If date is selected the task will appear on the given date each year until cancelled
                                    <br/><br/>
                                    If period is provided the task will appear after the given period have passed
                                    from the day the task was completed. It will keep repeating after the same period
                                    after each completion until cancelled
                                    <br/><br/>
                                    <i>
                                        Ex. Given a task with start time 01.01 and deadline 07.01 and repeat of 1 month
                                        and 2 weeks. Lets say the task was completed on 05.01. It will reappear after
                                        1 month and 2 weeks from the completion time, which in this case is 19.02
                                        (05.01 + 1 month is 05.02. After that we add 14 more days). The dead line will
                                        be 7 days from the reappear time, which in this case is 25.02
                                    </i>
                                </div>
                            }
                          />
                      </Grid>
                      <Grid size={3} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <AssigneesSection
                            readOnly={readOnly}
                            users={users}
                            assignees={currentTask.assignees}
                            setAssignees={(a) =>
                              setCurrentTask((currentTask) => ({...currentTask, assignees: a}))}
                          />
                      </Grid>
                  </Grid>
              </List>
          </Dialog>
      </React.Fragment>
    );
}