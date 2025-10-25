import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Box, Collapse, IconButton, styled} from "@mui/material";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import TaskPopup from "./TaskPopup.jsx";


Row.propTypes = {
    row: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        priority: PropTypes.string,
        start: PropTypes.string,
        deadline: PropTypes.string,
        repeat: PropTypes.string,
        assignees: PropTypes.string,
        subtasks: PropTypes.arrayOf(
          PropTypes.shape({
              priority: PropTypes.string,
              title: PropTypes.string,
              deadline: PropTypes.string,
              assignees: PropTypes.string,
          }),
        ),
    }),
    index: PropTypes.number,
    users: PropTypes.array,
    setTasks: PropTypes.func,
};

function Row(props) {
    const {row, index, users, setTasks} = props;
    const [open, setOpen] = React.useState(false);
    const [viewTaskPopup, setViewTaskPopup] = React.useState(false);

    return (
      <React.Fragment>
          <TableRow sx={{'& > *': {borderBottom: 'unset'}, backgroundColor: index % 2 === 0 ? '#BFBFBF' : '#A6A6A6'}}>
              <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                      {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                  </IconButton>
              </TableCell>
              <TableCell onClick={() => {setViewTaskPopup(true)}}>{row.priority}</TableCell>
              <TableCell onClick={() => {setViewTaskPopup(true)}}>{row.title}</TableCell>
              <TableCell onClick={() => {setViewTaskPopup(true)}}>{row.deadline}</TableCell>
              <TableCell onClick={() => {setViewTaskPopup(true)}}>
                  {row.assignees.length > 0 ?
                    row.assignees.join(", ") :
                    <span style={{fontStyle: "italic"}}>Any</span>
                  }
              </TableCell>
              <TableCell align={'right'}>
                  <IconButton sx={{backgroundColor: "#1976d2"}} size={"small"}>
                      <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                  </IconButton>
                  <IconButton sx={{backgroundColor: "#1976d2", marginLeft: "1%"}} size={"small"}>
                      <EditIcon sx={{color: "white"}} fontSize={"small"}/>
                  </IconButton>
                  <IconButton sx={{backgroundColor: "#1976d2", marginLeft: "1%"}} size={"small"}>
                      <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                  </IconButton>
              </TableCell>
          </TableRow>
          <TableRow sx={{backgroundColor: index % 2 === 0 ? '#BFBFBF' : '#A6A6A6'}}>
              <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                  <Collapse in={open} timeout="auto" unmountOnExit>
                      <Box sx={{margin: 1}}>
                          <Typography variant="h6" gutterBottom component="div">
                              Subtasks
                          </Typography>
                          <Table size="small" aria-label="purchases">
                              <TableHead>
                                  <TableRow>
                                      <TableCell>Priority</TableCell>
                                      <TableCell>Title</TableCell>
                                      <TableCell>Deadline</TableCell>
                                      <TableCell>Assignees</TableCell>
                                      <TableCell/>
                                  </TableRow>
                              </TableHead>
                              {/*<TableBody>*/}
                              {/*    {row.subtasks.map((subtaskRow) => (*/}
                              {/*      <StyledTableRow key={subtaskRow.title}>*/}
                              {/*          <TableCell>{subtaskRow.priority}</TableCell>*/}
                              {/*          <TableCell>{subtaskRow.title}</TableCell>*/}
                              {/*          <TableCell>{subtaskRow.deadline}</TableCell>*/}
                              {/*          <TableCell>{subtaskRow.assignees}</TableCell>*/}
                              {/*          <TableCell align={'right'}>*/}
                              {/*              <IconButton sx={{backgroundColor: "#1976d2"}} size={"small"}>*/}
                              {/*                  <CheckIcon sx={{color: "white"}} fontSize={"small"}/>*/}
                              {/*              </IconButton>*/}
                              {/*              <IconButton*/}
                              {/*                sx={{backgroundColor: "#1976d2", marginLeft: "1%"}}*/}
                              {/*                size={"small"}*/}
                              {/*              >*/}
                              {/*                  <EditIcon sx={{color: "white"}} fontSize={"small"}/>*/}
                              {/*              </IconButton>*/}
                              {/*              <IconButton*/}
                              {/*                sx={{backgroundColor: "#1976d2", marginLeft: "1%"}}*/}
                              {/*                size={"small"}*/}
                              {/*              >*/}
                              {/*                  <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>*/}
                              {/*              </IconButton>*/}
                              {/*          </TableCell>*/}
                              {/*      </StyledTableRow>*/}
                              {/*    ))}*/}
                              {/*</TableBody>*/}
                          </Table>
                      </Box>
                  </Collapse>
              </TableCell>
          </TableRow>
          {viewTaskPopup &&
            <TaskPopup
              open={viewTaskPopup}
              setOpen={setViewTaskPopup}
              users={["Any", ...users]}
              setTaskCreated={() => {}} //TODO: Update for task edited
              taskId={row.id}
              setTasks={setTasks}
            />
          }
      </React.Fragment>
    );
}

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "#8C5E58",
    },
    '&:nth-of-type(even)': {
        backgroundColor: "#A67F76",
    },
}));

export default Row;