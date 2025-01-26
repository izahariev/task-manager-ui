import '../css/App.css'
import {Container, Dialog, DialogTitle, Pagination, Stack, Switch} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import React from "react";
import TasksTable from "./TasksTable.jsx";
import UsersPopup from "./UsersPopup.jsx";


function App() {
    const [showUsersPopup, setShowUsersPopup] = React.useState(false);
    const [editedUser, setEditedUser] = React.useState("");

    return (
      <div className="App">
          <Container maxWidth="xxl" sx={{'marginBottom': '1%'}}>
              <Grid container>
                  <Grid item size={12} sx={{
                      marginTop: '2%',
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <h1>Active tasks</h1>
                  </Grid>
                  <Grid item size={12} sx={{margin: '1%  0 0.5% 0'}}>
                      <TasksTable/>
                  </Grid>
                  <Grid item size={12} sx={{
                      display: 'flex',
                      justifyContent: 'center',
                  }}>
                      <Pagination count={10}/>
                  </Grid>
                  <Grid item size={6} sx={{
                      display: 'flex',
                      justifyContent: 'left',
                  }}>
                      <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                          <Typography>Completed Tasks</Typography>
                          <Switch defaultChecked inputProps={{'aria-label': 'ant design'}}/>
                          <Typography>Active Tasks</Typography>
                      </Stack>
                  </Grid>
                  <Grid item size={6} sx={{
                      display: 'flex',
                      justifyContent: 'right',
                  }}>
                      <Button
                        variant="contained"
                        sx={{marginRight: '1%'}}
                        onClick={() => {
                            setShowUsersPopup(!showUsersPopup)
                        }}
                      >
                          Manage Users
                      </Button>
                      <Button variant="contained">Add Task</Button>
                  </Grid>
              </Grid>
          </Container>
          {showUsersPopup &&
            <Dialog
              open={showUsersPopup}
              onClose={() => setShowUsersPopup(false)}
              maxWidth={"xs"}
              fullWidth={true}
            >
                <DialogTitle align={"center"} sx={{backgroundColor: "#A6A6A6"}}>Users</DialogTitle>
                <UsersPopup editedUser={editedUser} setEditedUser={setEditedUser} />
            </Dialog>
          }
      </div>
    )
}

export default App
