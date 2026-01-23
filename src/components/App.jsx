import '../css/App.css'
import {Button, Container, Dialog, DialogTitle, Pagination} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {useActiveTab} from "../contexts/ActiveTabContext.jsx";
import {useErrors} from "../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../contexts/TasksContext.jsx";
import CustomAlert from "./CustomAlert.jsx";
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

    return (
      <div className="App">
          <Container maxWidth="xxl" sx={{'marginBottom': '1%', backgroundColor: 'transparent', position: 'relative'}}>
              <CustomAlert
                taskChangedMessage={taskChangedMessage}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                setTaskChangedMessage={setTaskChangedMessage}
                errorMessages={errorMessages}
                clearErrors={clearErrors}
              />
              <Grid container sx={{marginTop: '2%'}}>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1
                        className="tab-header"
                        style={{
                            color: activeTab === "inactive" ? '#2D3748' : '#718096',
                            fontWeight: activeTab === "inactive" ? 600 : 500
                        }}
                        onClick={() => {
                            setActiveTab("inactive");
                            refreshTasks({page: currentPage, isCompleted: false});
                        }}
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
                        className="tab-header"
                        style={{
                            color: activeTab === "active" ? '#2D3748' : '#718096',
                            fontWeight: activeTab === "active" ? 600 : 500
                        }}
                        onClick={() => {
                            setActiveTab("active");
                            refreshTasks({page: currentPage, isCompleted: false});
                        }}
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
                        className="tab-header"
                        style={{
                            color: activeTab === "completed" ? '#2D3748' : '#718096',
                            fontWeight: activeTab === "completed" ? 600 : 500
                        }}
                        onClick={() => {
                            setActiveTab("completed");
                            refreshTasks({page: currentPage, isCompleted: true});
                        }}
                      >
                          Completed tasks
                      </h1>
                  </Grid>
                  <Grid size={12} sx={{margin: '1%  0 0.5% 0'}}>
                      <TasksTable/>
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
                        onChange={(event, page) => {
                            refreshTasks({page: page});
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
                            setAddTaskPopup(!addTaskPopup)
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
                <UsersPopup/>
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
