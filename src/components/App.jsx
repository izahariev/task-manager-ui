import '../css/App.css'
import {Pagination, Stack, Switch} from "@mui/material";
import Typography from "@mui/material/Typography";
import TasksTable from "./TasksTable.jsx";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid2';
import Button from "@mui/material/Button";

function App() {
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
              <Pagination count={10} />
            </Grid>
            <Grid item size={6} sx={{
              display: 'flex',
              justifyContent: 'left',
            }}>
              <Stack direction="row" spacing={1} sx={{alignItems: 'center'}}>
                <Typography>Completed Tasks</Typography>
                <Switch defaultChecked inputProps={{ 'aria-label': 'ant design' }} />
                <Typography>Active Tasks</Typography>
              </Stack>
            </Grid>
            <Grid item size={6} sx={{
              display: 'flex',
              justifyContent: 'right',
            }}>
              <Button variant="contained" sx={{marginRight: '1%'}}>Manage Users</Button>
              <Button variant="contained">Add Task</Button>
            </Grid>
          </Grid>
        </Container>
      </div>
  )
}

export default App
