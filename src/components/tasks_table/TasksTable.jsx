import FilterListIcon from "@mui/icons-material/FilterList";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {useActiveTab} from "../../contexts/ActiveTabContext.jsx";
import {useTasks} from "../../contexts/TasksContext.jsx";
import {useUsers} from "../../contexts/UsersContext.jsx";
import Row from "../row/Row.jsx";
import FilterRow from "./FilterRow.jsx";

function TasksTable() {
    const {tasks, refreshTasks} = useTasks();
    const {users, refreshUsers} = useUsers();
    const {activeTab} = useActiveTab();
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);
    const [startTimeDateFilterValue, setStartTimeDateFilterValue] = React.useState(null);
    const [completionDateFilterValue, setCompletionDateFilterValue] = React.useState(null);

    /**
     * @typedef {{ elements: any[], totalPageCount: number, totalElementsCount: number }} Page
     */
    React.useEffect(() => {
        refreshTasks();
    }, [refreshTasks])

    React.useEffect(() => {
        if (filterEnabled) {
            refreshUsers();
        }
    }, [filterEnabled, refreshUsers])

    return (
      <TableContainer component={Paper} sx={{
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '8px',
          overflow: 'hidden'
      }}>
          <Table aria-label="collapsible table" key={activeTab}>
              <TableHead>
                  <TableRow sx={{
                      backgroundColor: '#2D3748',
                      '& .MuiTableCell-head': {
                          color: '#FFFFFF',
                          fontWeight: 600,
                          fontSize: '0.95rem'
                      }
                  }}>
                      <TableCell sx={{width: "1%"}}/>
                      <TableCell>Priority</TableCell>
                      <TableCell>Title</TableCell>
                      {activeTab === "completed" && <TableCell>Completed Time</TableCell>}
                      {activeTab === "inactive" && <TableCell>Start Time</TableCell>}
                      <TableCell>Deadline</TableCell>
                      <TableCell>Assignees</TableCell>
                      <TableCell align={"right"} sx={{minWidth: '7%'}}>
                          {filterEnabled ?
                            <FilterListOffIcon
                              onClick={() => {
                                  setFilterEnabled(!filterEnabled);
                                  refreshTasks();
                                  refreshUsers();
                              }}
                              sx={{color: '#FFFFFF', cursor: 'pointer'}}/> :
                            <FilterListIcon
                              onClick={() => setFilterEnabled(!filterEnabled)}
                              sx={{color: '#FFFFFF', cursor: 'pointer'}}
                            />
                          }
                      </TableCell>
                  </TableRow>
              </TableHead>
              {filterEnabled && (
                <FilterRow
                  activeTab={activeTab}
                  priorityFilterValue={priorityFilterValue}
                  setPriorityFilterValue={setPriorityFilterValue}
                  titleFilterValue={titleFilterValue}
                  setTitleFilterValue={setTitleFilterValue}
                  deadlineDateFilterValue={deadlineDateFilterValue}
                  setDeadlineDateFilterValue={setDeadlineDateFilterValue}
                  startTimeDateFilterValue={startTimeDateFilterValue}
                  setStartTimeDateFilterValue={setStartTimeDateFilterValue}
                  completionDateFilterValue={completionDateFilterValue}
                  setCompletionDateFilterValue={setCompletionDateFilterValue}
                  assigneesFilterValues={assigneesFilterValues}
                  setAssigneesFilterValues={setAssigneesFilterValues}
                  users={users}
                  refreshTasks={refreshTasks}
                />
              )}
              <TableBody>
                  {tasks.map((row, index) => (
                    <Row
                      key={row.title}
                      row={row}
                      index={index}
                    />
                  ))}
              </TableBody>
          </Table>
      </TableContainer>
    );
}

export default TasksTable;