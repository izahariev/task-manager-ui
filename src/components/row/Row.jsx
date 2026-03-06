import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReplayIcon from '@mui/icons-material/Replay';
import {IconButton} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";
import {useActiveTab} from "../../contexts/ActiveTabContext.jsx";
import {useTaskChangedMessage} from "../../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../../contexts/TasksContext.jsx";
import {completeTask, deleteTask, revertTask} from "../../js/BackendApis.js";
import SubtaskSection from "../subtasks_section/SubtaskSection.jsx";
import TaskPopup from "../task_popup/TaskPopup.jsx";
import RowButton from "./RowButton.jsx";
import TaskChangeDialog from "./TaskChangeDialog.jsx";


Row.propTypes = {
    row: PropTypes.shape({
        parentTaskId: PropTypes.string,
        id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        priority: PropTypes.string,
        start: PropTypes.string,
        deadline: PropTypes.string,
        completionDate: PropTypes.string,
        repeat: PropTypes.string,
        assignees: PropTypes.string
    }),
    index: PropTypes.number,
};

function Row(props) {
    const {refreshTasks} = useTasks();
    const {setTaskChangedMessage} = useTaskChangedMessage();
    const {activeTab} = useActiveTab();
    const {row, index} = props;
    const [expand, setExpand] = React.useState(false);
    const [viewTaskPopup, setViewTaskPopup] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(true);
    const [selectedTaskChange, setSelectedTaskChange] = React.useState(null);

    const getTaskChangeConfig = (action) => {
        const taskTitle = row.title;
        const configs = {
            delete: {
                title: "Delete Task",
                contentText: <>Are you sure you want to delete task <strong>&#34;{taskTitle}&#34;</strong>?</>,
                warningText: "This action can not be reverted!",
                confirmLabel: "Delete",
                confirmButtonSx: { backgroundColor: "#F44336", "&:hover": { backgroundColor: "#D32F2F" } },
            },
            complete: {
                title: "Complete Task",
                contentText: <>Are you sure you want to complete task <strong>&#34;{taskTitle}&#34;</strong>?</>,
                confirmLabel: "Complete",
                confirmButtonSx: { backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#45a049" } },
            },
            rollback: {
                title: "Rollback Task",
                contentText: <>Are you sure you want to rollback completed task <strong>&#34;{taskTitle}&#34;</strong>?</>,
                confirmLabel: "Rollback",
                confirmButtonSx: { backgroundColor: "#FF9800", "&:hover": { backgroundColor: "#F57C00" } },
            },
        };
        return { taskId: row.id, action, ...configs[action] };
    };

    const handleTaskChangeConfirm = async () => {
        if (!selectedTaskChange) return;
        const {taskId, action} = selectedTaskChange;
        if (action === "delete") {
            const r = await deleteTask(taskId);
            if (r.errors && r.errors.length > 0) throw r.errors;
            setTaskChangedMessage(`Task "${row.title}" deleted`);
        } else if (action === "complete") {
            const r = await completeTask(taskId);
            if (r.errors && r.errors.length > 0) throw r.errors;
            setExpand(false);
            setTaskChangedMessage(`Task "${row.title}" completed`);
        } else if (action === "rollback") {
            const r = await revertTask(taskId);
            if (r.errors && r.errors.length > 0) throw r.errors;
            setExpand(false);
            setTaskChangedMessage(`Task "${row.title}" rolled back`);
        }
        setSelectedTaskChange(null);
        refreshTasks();
    };

    const handleRowClick = (e) => {
        if (expand) {
            setExpand(false);
        } else {
            e.stopPropagation();
            setReadOnly(true);
            setViewTaskPopup(true);
        }
    };

    let isDeadlinePast = false;
    const d = row?.deadline;
    if (d != null && typeof d === 'string' && d.trim() !== '') {
        const parsed = dayjs(d);
        if (parsed.isValid()) {
            isDeadlinePast = parsed.isBefore(dayjs(), 'day');
        }
    }

    const isP0 = row?.priority === 'P0';
    const rowBg = isDeadlinePast
        ? (index % 2 === 0 ? '#E89898' : '#E08080')
        : isP0
            ? (index % 2 === 0 ? '#FFF59D' : '#FFEE58')
            : (index % 2 === 0 ? '#FFFFFF' : '#F7FAFC');
    const rowHoverBg = isDeadlinePast ? '#D86868' : isP0 ? '#FDD835' : '#EDF2F7';

    return (
      <React.Fragment>
          <TableRow sx={{
              '& > *': {borderBottom: 'unset'},
              backgroundColor: rowBg,
              '&:hover': {
                  backgroundColor: rowHoverBg,
                  transition: 'background-color 0.2s ease'
              },
              cursor: 'pointer'
          }}>
              <TableCell>
                  <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setExpand(!expand)}
                  >
                      {expand ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                  </IconButton>
              </TableCell>
              <TableCell onClick={handleRowClick}>{row.priority}</TableCell>
              <TableCell onClick={handleRowClick}>{row.title}</TableCell>
              {activeTab !== "active" && (
                <TableCell onClick={handleRowClick}>
                    {activeTab === "completed" ? row.completionDate : row.start}
                </TableCell>
              )}
              <TableCell onClick={handleRowClick}>{row.deadline}</TableCell>
              <TableCell onClick={handleRowClick}>
                  {row.assignees.length > 0 ?
                    row.assignees.join(", ") :
                    <span style={{fontStyle: "italic"}}>Any</span>
                  }
              </TableCell>
              <TableCell align={'right'}>
                  {activeTab !== "completed" && (
                    <RowButton
                      backgroundColor="#4CAF50"
                      hoverBackgroundColor="#45a049"
                      onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTaskChange(getTaskChangeConfig("complete"));
                      }}
                      icon={<CheckIcon sx={{color: "white"}} fontSize="small"/>}
                    />
                  )}
                  <RowButton
                    backgroundColor={activeTab === "completed" ? "#FF9800" : "#2196F3"}
                    hoverBackgroundColor={activeTab === "completed" ? "#F57C00" : "#1976D2"}
                    marginLeft="1%"
                    onClick={(e) => {
                        if (activeTab === "completed") {
                            e.stopPropagation();
                            setSelectedTaskChange(getTaskChangeConfig("rollback"));
                        } else {
                            e.stopPropagation();
                            setReadOnly(false);
                            setViewTaskPopup(true);
                        }
                    }}
                    icon={activeTab === "completed" ?
                      <ReplayIcon sx={{color: "white"}} fontSize="small"/> :
                      <EditIcon sx={{color: "white"}} fontSize="small"/>
                    }
                  />
                  <RowButton
                    backgroundColor="#F44336"
                    hoverBackgroundColor="#D32F2F"
                    marginLeft="1%"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTaskChange(getTaskChangeConfig("delete"));
                    }}
                    icon={<DeleteIcon sx={{color: "white"}} fontSize="small"/>}
                  />
              </TableCell>
          </TableRow>
          <TableRow sx={{
              backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F7FAFC',
              '&:hover': {
                  backgroundColor: '#EDF2F7',
                  transition: 'background-color 0.2s ease'
              }
          }}>
              <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={activeTab === "active" ? 7 : 8}>
                  <SubtaskSection
                    parentTaskId={row.id}
                    parentTaskTitle={row.title}
                    parentTaskStart={row.start}
                    expand={expand}
                  />
              </TableCell>
          </TableRow>
          {viewTaskPopup &&
            <TaskPopup
              open={viewTaskPopup}
              setOpen={setViewTaskPopup}
              taskId={row.id}
              customReadOnly={readOnly}
            />
          }
          {selectedTaskChange ? (
            <TaskChangeDialog
              open={true}
              onClose={() => setSelectedTaskChange(null)}
              title={selectedTaskChange.title}
              contentText={selectedTaskChange.contentText}
              warningText={selectedTaskChange.warningText}
              confirmLabel={selectedTaskChange.confirmLabel}
              onConfirm={handleTaskChangeConfirm}
              confirmButtonSx={selectedTaskChange.confirmButtonSx}
            />
          ) : null}
      </React.Fragment>
    );
}

export default Row;