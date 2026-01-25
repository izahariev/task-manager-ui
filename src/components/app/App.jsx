import '../../css/App.css'
import {Container, Pagination} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React from "react";
import {useActiveTab} from "../../contexts/ActiveTabContext.jsx";
import {useErrors} from "../../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../../contexts/TasksContext.jsx";
import TaskPopup from "../task_popup/TaskPopup.jsx";
import TasksTable from "../tasks_table/TasksTable.jsx";
import UsersPopup from "../users_popup/UsersPopup.jsx";
import AlertSection from "./AlertSection.jsx";
import ButtonsSection from "./ButtonsSection.jsx";
import TabsSection from "./TabsSection.jsx";

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
              <AlertSection
                taskChangedMessage={taskChangedMessage}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
                setTaskChangedMessage={setTaskChangedMessage}
                errorMessages={errorMessages}
                clearErrors={clearErrors}
              />
              <Grid container sx={{marginTop: '2%'}}>
                  <TabsSection
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    currentPage={currentPage}
                    refreshTasks={refreshTasks}
                  />
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
                  <ButtonsSection
                    onManageUsersClick={() => {
                        setShowUsersPopup(!showUsersPopup)
                    }}
                    onAddTaskClick={() => {
                        setAddTaskPopup(!addTaskPopup)
                    }}
                  />
              </Grid>
          </Container>
          {showUsersPopup &&
            <UsersPopup
              open={showUsersPopup}
              onClose={() => setShowUsersPopup(false)}
            />
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
