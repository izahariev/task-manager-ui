import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    TableContainer,
    TextField
} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import Row from "./Row.jsx";


function createData(priority, title, deadline, assignees) {
    return {
        priority,
        title,
        deadline,
        assignees,
        subtasks: [
            {
                priority: '2020-01-05',
                title: '11091700',
                deadline: '2020-01-05',
                assignees: 'Ivo'
            },
            {
                priority: '2020-01-05',
                title: '11091700',
                deadline: '2020-01-05',
                assignees: 'Ivo'
            },
        ],
    };
}

const rows = [
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
    createData('P0', 'Pay taxes', '2025-03-31', 'Ivo'),
    createData('P1', 'Throw out trash', '', 'Ivo'),
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
    createData('P0', 'Pay taxes', '2025-03-31', 'Ivo'),
    createData('P1', 'Throw out trash', '', 'Ivo'),
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
    createData('P0', 'Pay taxes', '2025-03-31', 'Ivo'),
];

function TasksTable() {
    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ];

    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [personName, setPersonName] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);

    const handlePriorityFilterValueChange = (event) => {
        setPriorityFilterValue(event.target.value);
    };

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
          typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
      <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
              <TableHead>
                  <TableRow sx={{backgroundColor: '#8C8C8C'}}>
                      <TableCell sx={{width: "1%"}}/>
                      <TableCell>Priority</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Deadline</TableCell>
                      <TableCell>Assignees</TableCell>
                      <TableCell align={"right"} sx={{minWidth: '7%'}}>
                          {!filterEnabled && <FilterListIcon onClick={() => setFilterEnabled(!filterEnabled)}/>}
                          {filterEnabled && <FilterListOffIcon onClick={() => setFilterEnabled(!filterEnabled)}/>}
                      </TableCell>
                  </TableRow>
              </TableHead>
              {filterEnabled &&
                <TableHead>
                  <TableRow sx={{backgroundColor: '#8C8C8C'}}>
                      <TableCell/>
                      <TableCell sx={{minWidth: '10%'}}>
                          <Grid container>
                              <Grid item size={6}>
                                  <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={priorityFilterValue}
                                    onChange={handlePriorityFilterValueChange}
                                    variant={"outlined"}
                                  >
                                      <MenuItem value={"P0"}>P0</MenuItem>
                                      <MenuItem value={"P1"}>P1</MenuItem>
                                      <MenuItem value={"P2"}>P2</MenuItem>
                                      <MenuItem value={"P3"}>P3</MenuItem>
                                  </Select>
                              </Grid>
                              <Grid item size={6}>
                                  <Button variant="contained" sx={{marginTop: "17%"}}>X</Button>
                              </Grid>
                          </Grid>
                      </TableCell>
                      <TableCell>
                          <Grid container spacing={1}>
                              <Grid item size={10}>
                                  <TextField id="outlined-basic" variant="outlined" multiline fullWidth={true}/>
                              </Grid>
                              <Grid item>
                                  <Button variant="contained" sx={{marginTop: "17%"}}>X</Button>
                              </Grid>
                          </Grid>
                      </TableCell>
                      <TableCell sx={{minWidth: '20%'}}>
                          <Grid container spacing={1}>
                              <Grid item>
                                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                                      <DatePicker/>
                                  </LocalizationProvider>
                              </Grid>
                              <Grid item>
                                  <Button variant="contained" sx={{marginTop: "17%"}}>X</Button>
                              </Grid>
                          </Grid>
                      </TableCell>
                      <TableCell sx={{minWidth: '15%'}}>
                          <Grid container spacing={1}>
                              <Grid item size={8}>
                                  <FormControl fullWidth={true}>
                                      <InputLabel id="demo-multiple-checkbox-label"></InputLabel>
                                      <Select
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        multiple
                                        value={personName}
                                        onChange={handleChange}
                                        input={<OutlinedInput/>}
                                        renderValue={(selected) => selected.join(', ')}
                                      >
                                          {names.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={personName.includes(name)} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                          ))}
                                      </Select>
                                  </FormControl>
                              </Grid>
                              <Grid item>
                                  <Button variant="contained" sx={{marginTop: "17%"}}>X</Button>
                              </Grid>
                          </Grid>
                      </TableCell>
                      <TableCell sx={{minWidth: '12%'}}>
                          <Button variant="contained">Clear all</Button>
                          <Button variant="contained" sx={{marginLeft: '5%'}}>Apply</Button>
                      </TableCell>
                  </TableRow>
              </TableHead>}
              <TableBody>
                  {rows.map((row, index) => (
                    <Row key={row.title} row={row} index={index}/>
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
    );
}

export default TasksTable;