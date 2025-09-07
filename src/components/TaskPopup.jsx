import CloseIcon from "@mui/icons-material/Close";
import {Alert, AppBar, Dialog, IconButton, Slide, TextField, Toolbar} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import {addTask, fetchAllTasks} from "../js/BackendApis.js";
import AssigneesSection from "./task_popup/AssigneesSection.jsx";
import PrioritySection from "./task_popup/PrioritySection.jsx";
import TimeSection from "./task_popup/TimeSection.jsx";

TaskPopup.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    readOnlyProp: PropTypes.bool,
    users: PropTypes.array,
    setTaskCreated: PropTypes.func
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
    const {open, setOpen, users, setTaskCreated} = props;
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [priority, setPriority] = React.useState("P3");
    const [startTime, setStartTime] = React.useState(dayjs().format('YYYY-MM-DD').toString());
    const [deadline, setDeadline] = React.useState("");
    const [repeat, setRepeat] = React.useState("");
    const [assignees, setAssignees] = React.useState([])
    const [readOnly] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState([]);

    const handleSaveClick = () => {
        const errors = [];
        if (title.trim() === '') {
            errors.push('Missing title');
        }

        if (errors.length !== 0) {
            setErrorMessages(errors);
            return;
        }

        addTask(title, description, priority, startTime, deadline, repeat, assignees)
          .then(() => {
              fetchAllTasks(1, 10).then(() => {
              })
              // fetchUsers().then(r => setUsers(r));
              // setNewUser("");
              setErrorMessages([]);
              setOpen(false);
              setTaskCreated(title);
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
          >
              <AppBar sx={{position: 'relative'}}>
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
                          Add Task
                      </Typography>
                      {!readOnly && (<Button autoFocus color="inherit" onClick={handleSaveClick}>
                          save
                      </Button>)}
                      {readOnly && (<Button autoFocus color="inherit" onClick={handleClose}>
                          edit
                      </Button>)}
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
                                        {errorMessages && errorMessages.map((errorMessage, index) => (<li key={index}>
                                            {errorMessage}
                                        </li>))}
                                    </ul>
                                </div>
                            </Grid>
                        </Grid>
                    </Alert>
                  }
                  <Grid container sx={{marginBottom: "2%"}}>
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
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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
                            {...(readOnly ? {disabled: true} : {})}
                            multiline={true}
                            rows={3}
                            onChange={(e) => setDescription(e.target.value)}
                            sx={{width: "96%", margin: "0, 2%"}} size={"small"}/>
                      </Grid>
                      <Grid size={3} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <PrioritySection priority={priority} setPriority={setPriority} readOnly={readOnly} />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection
                            title={"Start time"}
                            readOnly={readOnly}
                            timeValue={startTime}
                            setTimeValue={setStartTime}
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
                            timeValue={deadline}
                            setTimeValue={setDeadline}
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
                            timeValue={repeat}
                            setTimeValue={setRepeat}
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
                            assignees={assignees}
                            setAssignees={setAssignees}
                          />
                      </Grid>
                  </Grid>
              </List>
          </Dialog>
      </React.Fragment>
    );
}