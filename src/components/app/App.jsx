import '../../css/App.css'
import {Button, Container, Dialog, DialogTitle, Pagination} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {useActiveTab} from "../../contexts/ActiveTabContext.jsx";
import {useErrors} from "../../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../../contexts/TasksContext.jsx";
import TaskPopup from "../task_popup/TaskPopup.jsx";
import TasksTable from "../TasksTable.jsx";
import UsersPopup from "../UsersPopup.jsx";
import CustomAlert from "./CustomAlert.jsx";
import TabHeader from "./TabHeader.jsx";

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
                      <TabHeader
                        text="Inactive tasks"
                        isActive={activeTab === "inactive"}
                        onClick={() => {
                            setActiveTab("inactive");
                            refreshTasks({page: currentPage, isCompleted: false});
                        }}
                      />
                  </Grid>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <TabHeader
                        text="Active tasks"
                        isActive={activeTab === "active"}
                        onClick={() => {
                            setActiveTab("active");
                            refreshTasks({page: currentPage, isCompleted: false});
                        }}
                      />
                  </Grid>
                  <Grid size={4} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <TabHeader
                        text="Completed tasks"
                        isActive={activeTab === "completed"}
                        onClick={() => {
                            setActiveTab("completed");
                            refreshTasks({page: currentPage, isCompleted: true});
                        }}
                      />
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
