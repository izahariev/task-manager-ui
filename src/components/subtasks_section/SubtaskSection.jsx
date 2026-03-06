import {Box, Collapse, Pagination} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import {useActiveTab} from "../../contexts/ActiveTabContext.jsx";
import {useErrors} from "../../contexts/ErrorMessagesContext.jsx";
import {useTaskChangedMessage} from "../../contexts/TaskChangedMessageContext.jsx";
import {useTasks} from "../../contexts/TasksContext.jsx";
import {useUsers} from "../../contexts/UsersContext.jsx";
import {completeTask, deleteTask, fetchTasks, revertTask} from "../../js/BackendApis.js";
import TaskChangeDialog from "../row/TaskChangeDialog.jsx";
import TaskPopup from "../task_popup/TaskPopup.jsx";
import SubtaskHeaderSection from "./SubtaskHeaderSection.jsx";
import SubtasksTable from "./SubtasksTable.jsx";

SubtaskSection.propTypes = {
    parentTaskId: PropTypes.string,
    parentTaskTitle: PropTypes.string,
    parentTaskStart: PropTypes.string,
    expand: PropTypes.bool.isRequired
};

function SubtaskSection(props) {
    const {
        parentTaskId,
        parentTaskTitle,
        parentTaskStart,
        expand
    } = props;
    const {activeTab} = useActiveTab();
    const {tasksRefreshTimestamp} = useTasks();
    const {users, refreshUsers} = useUsers();
    const {addErrors, clearErrors} = useErrors();
    const {setTaskChangedMessage} = useTaskChangedMessage();
    const [subtasks, setSubtasks] = React.useState([]);
    const [subtaskPageCount, setSubtaskPageCount] = React.useState(0);
    const [subtaskCurrentPage, setSubtaskCurrentPage] = React.useState(1);
    const [selectedSubtaskChange, setSelectedSubtaskChange] = React.useState(null);
    const [openAddSubtaskPopup, setOpenAddSubtaskPopup] = React.useState(false);
    const [viewSubtaskPopup, setViewSubtaskPopup] = React.useState(false);
    const [selectedSubtaskId, setSelectedSubtaskId] = React.useState(null);
    const [subtaskReadOnly, setSubtaskReadOnly] = React.useState(true);
    const [subtaskTypePending, setSubtaskTypePending] = React.useState(true);
    const [priorityFilterValue, setPriorityFilterValue] = React.useState('');
    const [titleFilterValue, setTitleFilterValue] = React.useState('');
    const [assigneesFilterValues, setAssigneesFilterValues] = React.useState([]);
    const [filterEnabled, setFilterEnabled] = React.useState(false);
    const [deadlineDateFilterValue, setDeadlineDateFilterValue] = React.useState(null);
    const [startTimeDateFilterValue, setStartTimeDateFilterValue] = React.useState(null);
    const [completionDateFilterValue, setCompletionDateFilterValue] = React.useState(null);

    /**
     * @param {{
     *   priority?: string|null,
     *   title?: string|null,
     *   startDate?: Date|null,
     *   deadline?: Date|null,
     *   completionDate?: Date|null,
     *   assignees?: any[]|null,
     *   isCompleted?: boolean|null,
     *   page?: number
     * }} params
     */
    const refreshSubtasks = ({
                                 priority = null, title = null, startDate = null, deadline = null,
                                 completionDate = null, assignees = null, isCompleted = null,
                                 page = subtaskCurrentPage
                             } = {}) => {
        fetchTasks(parentTaskId, priority, title, startDate, deadline, completionDate, isCompleted, assignees,
          page, 5)
          .then(r => {
              if (r.errors.length > 0) {
                  addErrors(r.errors);
              } else {
                  setSubtasks(r.content.elements);
                  setSubtaskPageCount(r.content.totalPageCount);
                  setSubtaskCurrentPage(page);
                  clearErrors();
              }
          }).catch(error => {
            const errors = []
            error.response.data['errors'].forEach((error) => {
                errors.push(error['description']);
            })
            addErrors(errors);
        });
    };

    React.useEffect(() => {
        if (expand) {
            fetchTasks(parentTaskId, null, null, null, null, null,
              activeTab === "completed" ? null : false, null, 1, 5)
              .then(r => {
                  if (r.errors.length > 0) {
                      addErrors(r.errors);
                  } else {
                      setSubtasks(r.content.elements);
                      setSubtaskPageCount(r.content.totalPageCount);
                      setSubtaskCurrentPage(1);
                  }
              }).catch(error => {
                const errors = []
                error.response.data['errors'].forEach((error) => {
                    errors.push(error['description']);
                })
                addErrors(errors);
            });
            setSubtaskTypePending(true);
        } else {
            setFilterEnabled(false);
            setPriorityFilterValue("");
            setTitleFilterValue("");
            setDeadlineDateFilterValue(null);
            setStartTimeDateFilterValue(null);
            setCompletionDateFilterValue(null);
            setAssigneesFilterValues([]);
        }
    }, [activeTab, addErrors, expand, parentTaskId, tasksRefreshTimestamp])

    const getSubtaskChangeConfig = (subtaskRow, action) => {
        const subtaskTitle = subtaskRow.title;
        const configs = {
            delete: {
                title: "Delete Subtask",
                contentText: <>Are you sure you want to delete subtask <strong>&#34;{subtaskTitle}&#34;</strong>?</>,
                warningText: "This action can not be reverted!",
                confirmLabel: "Delete",
                confirmButtonSx: { backgroundColor: "#F44336", "&:hover": { backgroundColor: "#D32F2F" } },
            },
            complete: {
                title: "Complete Subtask",
                contentText: <>Are you sure you want to complete subtask <strong>&#34;{subtaskTitle}&#34;</strong>?</>,
                confirmLabel: "Complete",
                confirmButtonSx: { backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#45a049" } },
            },
            rollback: {
                title: "Rollback Subtask",
                contentText: <>Are you sure you want to rollback completed subtask <strong>&#34;{subtaskTitle}&#34;</strong>?</>,
                confirmLabel: "Rollback",
                confirmButtonSx: { backgroundColor: "#FF9800", "&:hover": { backgroundColor: "#F57C00" } },
            },
        };
        return { subtaskId: subtaskRow.id, subtaskTitle, action, ...configs[action] };
    };

    const handleSubtaskChangeConfirm = async () => {
        if (!selectedSubtaskChange) return;
        const {subtaskId, subtaskTitle, action} = selectedSubtaskChange;
        let r;
        if (action === "delete") {
            r = await deleteTask(subtaskId);
            setTaskChangedMessage(`Subtask "${subtaskTitle}" deleted`);
        } else if (action === "complete") {
            r = await completeTask(subtaskId);
            setTaskChangedMessage(`Subtask "${subtaskTitle}" completed`);
        } else if (action === "rollback") {
            r = await revertTask(subtaskId);
            setTaskChangedMessage(`Subtask "${subtaskTitle}" rolled back`);
        }

        if (r.errors && r.errors.length > 0) {
            setTaskChangedMessage(null);
            throw { response: { data: { errors: r.errors.map((e) => e?.description ?? e) } } };
        }
        setSelectedSubtaskChange(null);
        refreshSubtasks({
            priority: priorityFilterValue || null,
            title: titleFilterValue || null,
            startDate: null,
            deadline: deadlineDateFilterValue || null,
            completionDate: null,
            assignees: assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
            isCompleted: !subtaskTypePending,
            page: subtaskCurrentPage
        });
    };

    const handleRowClick = (e, subtaskRow, readOnly = true) => {
        e.stopPropagation();
        setSelectedSubtaskId(subtaskRow.id);
        setSubtaskReadOnly(readOnly);
        setViewSubtaskPopup(true);
    };

    return (
      <React.Fragment>
          <Collapse in={expand} timeout="auto" unmountOnExit>
              <Box sx={{margin: 1}}>
                  <SubtaskHeaderSection
                      activeTab={activeTab}
                      subtaskTypePending={subtaskTypePending}
                      onSubtaskTypeChange={(value) => {
                          setSubtaskTypePending(value === 'pending');
                          setSubtaskCurrentPage(1);
                          refreshSubtasks({
                              priority: priorityFilterValue || null,
                              title: titleFilterValue || null,
                              startDate: null,
                              deadline: deadlineDateFilterValue || null,
                              completionDate: null,
                              assignees: assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                              isCompleted: value === 'completed',
                              page: 1
                          });
                      }}
                      onAddClick={() => setOpenAddSubtaskPopup(true)}
                  />
                  <SubtasksTable
                      subtasks={subtasks}
                      activeTab={activeTab}
                      subtaskTypePending={subtaskTypePending}
                      filterEnabled={filterEnabled}
                      onFilterEnable={() => {
                          setFilterEnabled(true);
                          refreshUsers();
                      }}
                      onFilterDisable={() => {
                          setFilterEnabled(false);
                          refreshSubtasks({
                              isCompleted: !subtaskTypePending,
                              page: subtaskCurrentPage
                          });
                      }}
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
                      onRefreshWithFilters={(filters) => {
                          refreshSubtasks({
                              priority: filters.priority || null,
                              title: filters.title || null,
                              startDate: filters.startDate || null,
                              deadline: filters.deadline || null,
                              completionDate: filters.completionDate || null,
                              assignees: filters.assignees?.length ? filters.assignees : null,
                              isCompleted: filters.isCompleted ?? !subtaskTypePending,
                              page: filters.page ?? 1
                          });
                      }}
                      onRowClick={handleRowClick}
                      onCompleteClick={(e, subtaskRow) => {
                          e.stopPropagation();
                          setSelectedSubtaskChange(getSubtaskChangeConfig(subtaskRow, "complete"));
                      }}
                      onEditClick={(e, subtaskRow) => handleRowClick(e, subtaskRow, false)}
                      onDeleteClick={(e, subtaskRow) => {
                          e.stopPropagation();
                          setSelectedSubtaskChange(getSubtaskChangeConfig(subtaskRow, "delete"));
                      }}
                      onRollbackClick={(e, subtaskRow) => {
                          e.stopPropagation();
                          setSelectedSubtaskChange(getSubtaskChangeConfig(subtaskRow, "rollback"));
                      }}
                  />
                  {subtaskPageCount > 0 &&
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: 2,
                        marginBottom: 1
                    }}>
                        <Pagination
                          count={subtaskPageCount}
                          page={subtaskCurrentPage}
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
                          showFirstButton
                          showLastButton
                          onChange={(event, page) => {
                              refreshSubtasks({
                                  priority: filterEnabled ? priorityFilterValue || null : null,
                                  title: filterEnabled ? titleFilterValue || null : null,
                                  startDate: null,
                                  deadline: filterEnabled ? deadlineDateFilterValue || null : null,
                                  completionDate: null,
                                  assignees: filterEnabled && assigneesFilterValues.length > 0 ? assigneesFilterValues : null,
                                  isCompleted: !subtaskTypePending,
                                  page: page
                              });
                          }}
                        />
                    </Box>
                  }
              </Box>
          </Collapse>
          {selectedSubtaskChange ? (
            <TaskChangeDialog
              open={true}
              onClose={() => setSelectedSubtaskChange(null)}
              title={selectedSubtaskChange.title}
              contentText={selectedSubtaskChange.contentText}
              warningText={selectedSubtaskChange.warningText}
              confirmLabel={selectedSubtaskChange.confirmLabel}
              onConfirm={handleSubtaskChangeConfirm}
              confirmButtonSx={selectedSubtaskChange.confirmButtonSx}
            />
          ) : null}
          {openAddSubtaskPopup &&
            <TaskPopup
              open={openAddSubtaskPopup}
              setOpen={setOpenAddSubtaskPopup}
              setSubtasks={setSubtasks}
              parentTaskId={parentTaskId}
              parentTask={parentTaskTitle}
              parentTaskStart={parentTaskStart}
              refreshSubtasks={refreshSubtasks}
            />
          }
          {viewSubtaskPopup &&
            <TaskPopup
              open={viewSubtaskPopup}
              setOpen={setViewSubtaskPopup}
              taskId={selectedSubtaskId}
              parentTaskId={parentTaskId}
              parentTask={parentTaskTitle}
              customReadOnly={subtaskReadOnly}
              refreshSubtasks={refreshSubtasks}
            />
          }
      </React.Fragment>
    );
}

export default SubtaskSection;
