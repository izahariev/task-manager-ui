import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import {Table, TableBody, TableCell, TableHead, TableRow,} from "@mui/material";
import PropTypes from "prop-types";
import RowButton from "../row/RowButton.jsx";
import FilterRow from "../tasks_table/FilterRow.jsx";

SubtasksTable.propTypes = {
    subtasks: PropTypes.array.isRequired,
    activeTab: PropTypes.string,
    subtaskTypePending: PropTypes.bool.isRequired,
    filterEnabled: PropTypes.bool.isRequired,
    onFilterEnable: PropTypes.func.isRequired,
    onFilterDisable: PropTypes.func.isRequired,
    priorityFilterValue: PropTypes.string.isRequired,
    setPriorityFilterValue: PropTypes.func.isRequired,
    titleFilterValue: PropTypes.string.isRequired,
    setTitleFilterValue: PropTypes.func.isRequired,
    deadlineDateFilterValue: PropTypes.any,
    setDeadlineDateFilterValue: PropTypes.func.isRequired,
    startTimeDateFilterValue: PropTypes.any,
    setStartTimeDateFilterValue: PropTypes.func.isRequired,
    completionDateFilterValue: PropTypes.any,
    setCompletionDateFilterValue: PropTypes.func.isRequired,
    assigneesFilterValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    setAssigneesFilterValues: PropTypes.func.isRequired,
    users: PropTypes.array,
    onRefreshWithFilters: PropTypes.func.isRequired,
    onRowClick: PropTypes.func.isRequired,
    onCompleteClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired,
};

function SubtasksTable(props) {
    const {
        subtasks,
        activeTab,
        subtaskTypePending,
        filterEnabled,
        onFilterEnable,
        onFilterDisable,
        priorityFilterValue,
        setPriorityFilterValue,
        titleFilterValue,
        setTitleFilterValue,
        deadlineDateFilterValue,
        setDeadlineDateFilterValue,
        startTimeDateFilterValue,
        setStartTimeDateFilterValue,
        completionDateFilterValue,
        setCompletionDateFilterValue,
        assigneesFilterValues,
        setAssigneesFilterValues,
        users,
        onRefreshWithFilters,
        onRowClick,
        onCompleteClick,
        onEditClick,
        onDeleteClick,
    } = props;

    return (
        <Table size="small" aria-label="purchases">
            <TableHead>
                <TableRow>
                    <TableCell>Priority</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Deadline</TableCell>
                    <TableCell>Assignees</TableCell>
                    <TableCell align={"right"} sx={{minWidth: '7%'}}>
                        {!filterEnabled && (
                            <FilterListIcon
                                onClick={onFilterEnable}
                                sx={{color: '#2D3748', cursor: 'pointer'}}
                            />
                        )}
                        {filterEnabled && (
                            <FilterListOffIcon
                                onClick={onFilterDisable}
                                sx={{color: '#2D3748', cursor: 'pointer'}}
                            />
                        )}
                    </TableCell>
                </TableRow>
            </TableHead>
            {filterEnabled && (
                <FilterRow
                    activeTab="active"
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
                    refreshTasks={(filters) => {
                        if (filters) {
                            onRefreshWithFilters({
                                ...filters,
                                isCompleted: !subtaskTypePending,
                                page: 1
                            });
                        } else {
                            onRefreshWithFilters({
                                isCompleted: !subtaskTypePending,
                                page: 1
                            });
                        }
                    }}
                    showExpandColumn={false}
                />
            )}
            <TableBody>
                {/** @type {React.ReactNode} */
                (subtasks.map((subtaskRow, subtaskIndex) => (
                    <TableRow
                        key={subtaskRow.title}
                        sx={{
                            backgroundColor: subtaskIndex % 2 === 0 ? '#FFFFFF' : '#F7FAFC',
                            '&:hover': {
                                backgroundColor: '#EDF2F7',
                                transition: 'background-color 0.2s ease'
                            }
                        }}
                    >
                        <TableCell onClick={(e) => onRowClick(e, subtaskRow)} sx={{cursor: 'pointer'}}>
                            {subtaskRow.priority}
                        </TableCell>
                        <TableCell onClick={(e) => onRowClick(e, subtaskRow)} sx={{cursor: 'pointer'}}>
                            {subtaskRow.title}
                        </TableCell>
                        <TableCell onClick={(e) => onRowClick(e, subtaskRow)} sx={{cursor: 'pointer'}}>
                            {subtaskRow.deadline}
                        </TableCell>
                        <TableCell onClick={(e) => onRowClick(e, subtaskRow)} sx={{cursor: 'pointer'}}>
                            {subtaskRow.assignees.length > 0 ?
                              subtaskRow.assignees.join(", ") :
                              <span style={{fontStyle: "italic"}}>Any</span>
                            }
                        </TableCell>
                        <TableCell align={'right'}>
                            {activeTab !== "completed" && (subtaskTypePending || subtaskTypePending === null) && (
                                <RowButton
                                    backgroundColor="#4CAF50"
                                    hoverBackgroundColor="#45a049"
                                    onClick={(e) => onCompleteClick(e, subtaskRow)}
                                    icon={<CheckIcon sx={{color: "white"}} fontSize="small"/>}
                                />
                            )}
                            {activeTab !== "completed" && (subtaskTypePending || subtaskTypePending === null) && (
                                <RowButton
                                    backgroundColor="#2196F3"
                                    hoverBackgroundColor="#1976D2"
                                    marginLeft="1%"
                                    onClick={(e) => onEditClick(e, subtaskRow)}
                                    icon={<EditIcon sx={{color: "white"}} fontSize="small"/>}
                                />
                            )}
                            <RowButton
                                backgroundColor="#F44336"
                                hoverBackgroundColor="#D32F2F"
                                marginLeft="1%"
                                onClick={(e) => onDeleteClick(e, subtaskRow)}
                                icon={<DeleteIcon sx={{color: "white"}} fontSize="small"/>}
                            />
                        </TableCell>
                    </TableRow>
                )))}
            </TableBody>
        </Table>
    );
}

export default SubtasksTable;
