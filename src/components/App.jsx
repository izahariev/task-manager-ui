import '../css/App.css'
import {Alert, Container, Dialog, DialogTitle, Fade, Pagination} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import React from "react";
import {useActiveTab} from "../contexts/ActiveTabContext.jsx";
import {useErrors} from "../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../contexts/TasksContext.jsx";
import TaskPopup from "./TaskPopup.jsx";
import TasksTable from "./TasksTable.jsx";
import UsersPopup from "./UsersPopup.jsx";

function App() {
    const {setTasks, currentPage, pageCount, refreshTasks} = useTasks();
    const {errorMessages, clearErrors} = useErrors();
    const {taskChangedMessage, showAlert, setShowAlert, setTaskChangedMessage} = useTaskChangedMessage();
    const {activeTab, setActiveTab} = useActiveTab();
    const [showUsersPopup, setShowUsersPopup] = React.useState(false);
    const [addTaskPopup, setAddTaskPopup] = React.useState(false);

    function getTasksPage(event, page) {
        refreshTasks({page: page});
    }

    function handleInactiveTasksClick() {
        setActiveTab("inactive");
        refreshTasks({page: currentPage, isCompleted: false});
    }

    function handleActiveTasksClick() {
        setActiveTab("active");
        refreshTasks({page: currentPage, isCompleted: false});
    }

    function handleCompletedTasksClick() {
        setActiveTab("completed");
        refreshTasks({page: currentPage, isCompleted: true});
    }

    return (
      <div className="App">
          <Container maxWidth="xxl" sx={{'marginBottom': '1%', backgroundColor: 'transparent'}}>
              {taskChangedMessage !== null &&
                <Fade in={showAlert} timeout={500}>
                    <Alert
                      variant="filled"
                      severity="success"
                      sx={{marginTop: '0.5%'}}
                      onClose={() => {
                          setShowAlert(false);
                          setTimeout(() => {
                              setTaskChangedMessage(null);
                          }, 500);
                      }}
                    >
                        <Grid container>
                            <Grid size={12} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <div style={{display: 'flex', justifyContent: 'space-around'}}>
                                    {taskChangedMessage}
                                </div>
                            </Grid>
                        </Grid>
                    </Alert>
                </Fade>
              }
              {errorMessages.length !== 0 &&
                <Alert variant="filled" severity="error" onClose={clearErrors}>
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
                      <h1 
                        style={{
                            color: activeTab === "inactive" ? '#2D3748' : '#718096', 
                            fontWeight: activeTab === "inactive" ? 600 : 500,
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                        onClick={handleInactiveTasksClick}
                      >
                          Inactive tasks
                      </h1>
                  </Grid>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1 
                        style={{
                            color: activeTab === "active" ? '#2D3748' : '#718096', 
                            fontWeight: activeTab === "active" ? 600 : 500,
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                        onClick={handleActiveTasksClick}
                      >
                          Active tasks
                      </h1>
                  </Grid>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1 
                        style={{
                            color: activeTab === "completed" ? '#2D3748' : '#718096', 
                            fontWeight: activeTab === "completed" ? 600 : 500,
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                        onClick={handleCompletedTasksClick}
                      >
                          Completed tasks
                      </h1>
                  </Grid>
                  <Grid size={12} sx={{margin: '1%  0 0.5% 0'}}>
                      <TasksTable />
                  </Grid>
                  <Grid size={12} sx={{
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <Pagination
                        count={pageCount}
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
                        showFirstButton showLastButton
                        onChange={getTasksPage}
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
                        onClick={() => {setAddTaskPopup(!addTaskPopup)}}>
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
                <UsersPopup />
            </Dialog>
          }
          {addTaskPopup &&
            <TaskPopup
              open={addTaskPopup}
              setOpen={setAddTaskPopup}
              setTasks={setTasks}
              currentPage={currentPage}
            />
          }
      </div>
    )
}

export default App
