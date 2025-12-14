import '../css/App.css'
import {Alert, Container, Dialog, DialogTitle, Fade, Pagination} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import React from "react";
import {fetchAllTasks, fetchUsers} from "../js/BackendApis.js";
import TaskPopup from "./TaskPopup.jsx";
import TasksTable from "./TasksTable.jsx";
import UsersPopup from "./UsersPopup.jsx";

function App() {
    const [showUsersPopup, setShowUsersPopup] = React.useState(false);
    const [addTaskPopup, setAddTaskPopup] = React.useState(false);
    const [users, setUsers] = React.useState([]);
    const [tasks, setTasks] = React.useState([])
    const [taskChanged, setTaskChanged] = React.useState(null);
    const [showAlert, setShowAlert] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState([])
    const removeTimerRef = React.useRef(null);

    React.useEffect(() => {
        //TODO: Increase abstraction. Try not to repeat code
        fetchUsers()
          .then(r => {
              if (r.errors.length > 0) {
                  setErrorMessages([...r.errors]);
              } else {
                  setUsers(r.content.elements)
              }
          })
          .catch(error => {
              const errors = []
              error.response.data['errors'].forEach((error) => {
                  errors.push(error['description']);
              })
              setErrorMessages([...errors]);
          });
    }, [])

    //TODO: Check fetch tasks logic. Should fetch only one page (9-10 tasks) everywhere
    React.useEffect(() => {
        fetchAllTasks()
          .then(r => {
              if (r.errors.length > 0) {
                  setErrorMessages([...r.errors]);
              } else {
                  setTasks(r.content.elements)
              }
          })
          .catch(error => {
              const errors = []
              error.response.data['errors'].forEach((error) => {
                  errors.push(error['description']);
              })
              setErrorMessages([...errors]);
          });
    }, [])

    React.useEffect(() => {
        if (taskChanged !== null) {
            setShowAlert(true);
            const timer = setTimeout(() => {
                setShowAlert(false);
                // Wait for fade-out animation to complete (500ms) before removing from DOM
                removeTimerRef.current = setTimeout(() => {
                    setTaskChanged(null);
                }, 500);
            }, 5000);
            return () => {
                clearTimeout(timer);
                if (removeTimerRef.current) {
                    clearTimeout(removeTimerRef.current);
                    removeTimerRef.current = null;
                }
            };
        }
    }, [taskChanged])

    return (
      <div className="App">
          <Container maxWidth="xxl" sx={{'marginBottom': '1%', backgroundColor: 'transparent'}}>
              {taskChanged !== null &&
                <Fade in={showAlert} timeout={500}>
                    <Alert
                      variant="filled"
                      severity="success"
                      sx={{marginTop: '0.5%'}}
                      onClose={() => {
                          setShowAlert(false);
                          setTimeout(() => {
                              setTaskChanged(null);
                          }, 500);
                      }}
                    >
                        <Grid container>
                            <Grid size={12} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    Task &#34;{taskChanged.title}&#34; {taskChanged.change}
                                </div>
                            </Grid>
                        </Grid>
                    </Alert>
                </Fade>
              }
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
                                      </li>))}
                                </ul>
                            </div>
                        </Grid>
                    </Grid>
                </Alert>
              }
              <Grid container>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1 style={{color: '#718096', fontWeight: 500}}>Inactive tasks</h1>
                  </Grid>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1 style={{color: '#2D3748', fontWeight: 600}}>Active tasks</h1>
                  </Grid>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1 style={{color: '#718096', fontWeight: 500}}>Completed tasks</h1>
                  </Grid>
                  <Grid size={12} sx={{margin: '1%  0 0.5% 0'}}>
                      <TasksTable
                        users={users}
                        tasks={tasks}
                        setTasks={setTasks}
                        setTaskChanged={setTaskChanged}
                        setErrorMessages={setErrorMessages}
                      />
                  </Grid>
                  <Grid size={12} sx={{
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <Pagination
                        count={10}
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
                      />
                  </Grid>
                  <Grid size={6} sx={{
                      display: 'flex',
                      justifyContent: 'left',
                  }}>
                  </Grid>
                  <Grid size={6} sx={{
                      display: 'flex',
                      justifyContent: 'right',
                  }}>
                      <Button
                        variant="contained"
                        sx={{
                            marginRight: '1%',
                            backgroundColor: '#5B7FA6',
                            '&:hover': {
                                backgroundColor: '#4A6B8F',
                            },
                            transition: 'background-color 0.2s ease'
                        }}
                        onClick={() => {
                            fetchUsers().then(r => {
                                if (r.errors.length > 0) {
                                    setErrorMessages([...r.errors]);
                                } else {
                                    setUsers(r.content.elements)
                                }
                            });
                            setShowUsersPopup(!showUsersPopup)
                        }}
                      >
                          Manage Users
                      </Button>
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
                            fetchUsers().then(r => {
                                if (r.errors.length > 0) {
                                    setErrorMessages([...r.errors]);
                                } else {
                                    setUsers(r.content.elements)
                                    setAddTaskPopup(!addTaskPopup)
                                }
                            });
                        }}>
                          Add Task
                      </Button>
                  </Grid>
              </Grid>
          </Container>
          {showUsersPopup &&
            <Dialog
              open={showUsersPopup}
              onClose={() => setShowUsersPopup(false)}
              maxWidth={"xs"}
              fullWidth={true}
              slotProps={{
                  paper: {
                      sx: {
                          borderRadius: '8px',
                          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                      }
                  }
              }}
            >
                <DialogTitle align={"center"} sx={{
                    backgroundColor: "#2D3748",
                    color: "#FFFFFF",
                    fontWeight: 600
                }}>Users</DialogTitle>
                <UsersPopup users={users} setUsers={setUsers}/>
            </Dialog>
          }
          {addTaskPopup &&
            <TaskPopup
              open={addTaskPopup}
              setOpen={setAddTaskPopup}
              users={["Any", ...users]}
              setTaskChanged={setTaskChanged}
              setTasks={setTasks}
            />
          }
      </div>
    )
}

export default App
