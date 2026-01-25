import {Button, TableCell, TableHead, TableRow} from "@mui/material";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import AssigneesFilter from "./AssigneesFilter.jsx";
import PriorityFilter from "./PriorityFilter.jsx";
import TimeFilter from "./TimeFilter.jsx";
import TitleFilter from "./TitleFilter.jsx";

export default function FilterRow({
                                      activeTab,
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
                                      refreshTasks
                                  }) {
    return (
      <TableHead>
          <TableRow
            sx={{
                backgroundColor: "#F7FAFC",
                borderBottom: "2px solid #E2E8F0",
                "& .MuiTableCell-head": {
                    padding: "16px 8px",
                    borderBottom: "none"
                }
            }}
          >
              <TableCell sx={{width: "1%"}}/>
              <TableCell sx={{minWidth: "10%", py: 1.5}}>
                  <PriorityFilter
                    priorityFilterValue={priorityFilterValue}
                    setPriorityFilterValue={setPriorityFilterValue}
                  />
              </TableCell>
              <TableCell sx={{py: 1.5}}>
                  <TitleFilter
                    titleFilterValue={titleFilterValue}
                    setTitleFilterValue={setTitleFilterValue}
                  />
              </TableCell>
              {activeTab !== "active" && (
                <TableCell sx={{minWidth: "21%", py: 1.5}}>
                    <TimeFilter
                      filterValue={activeTab === "completed" ?
                        completionDateFilterValue :
                        startTimeDateFilterValue
                      }
                      setFilterValue={activeTab === "completed" ?
                        setCompletionDateFilterValue :
                        setStartTimeDateFilterValue
                      }
                      tooltip={activeTab === "completed" ?
                        "Filters the tasks which have completion date greater or equal to the specified" :
                        "Filters the tasks which have start time greater or equal to the specified"
                      }
                    />
                </TableCell>
              )}
              <TableCell sx={{minWidth: "21%", py: 1.5}}>
                  <TimeFilter
                    filterValue={deadlineDateFilterValue}
                    setFilterValue={setDeadlineDateFilterValue}
                    tooltip="Filters the tasks which have deadline greater or equal to the specified"
                  />
              </TableCell>
              <TableCell sx={{minWidth: "15%", py: 1.5}}>
                  <AssigneesFilter
                    assigneesFilterValues={assigneesFilterValues}
                    setAssigneesFilterValues={setAssigneesFilterValues}
                    users={users}
                  />
              </TableCell>
              <TableCell align="right" sx={{minWidth: "13%", py: 1.5}}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                        setPriorityFilterValue("");
                        setTitleFilterValue("");
                        setDeadlineDateFilterValue(null);
                        setStartTimeDateFilterValue(null);
                        setCompletionDateFilterValue(null);
                        setAssigneesFilterValues([]);
                        refreshTasks();
                    }}
                    sx={{
                        mr: 1,
                        borderColor: "#CBD5E0",
                        color: "#4A5568",
                        textTransform: "none",
                        "&:hover": {
                            borderColor: "#5B7FA6",
                            backgroundColor: "rgba(91, 127, 166, 0.08)"
                        }
                    }}
                  >
                      Clear all
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                        const filters = {
                            priority: priorityFilterValue,
                            title: titleFilterValue,
                            startDate:
                              startTimeDateFilterValue !== null
                                ? startTimeDateFilterValue
                                : activeTab === "inactive"
                                  ? dayjs()
                                  : null,
                            deadline: deadlineDateFilterValue,
                            completionDate: completionDateFilterValue,
                            assignees: assigneesFilterValues
                        };
                        refreshTasks(filters);
                    }}
                    sx={{
                        backgroundColor: "#5B7FA6",
                        textTransform: "none",
                        "&:hover": {
                            backgroundColor: "#4A6B8F"
                        },
                        transition: "background-color 0.2s ease"
                    }}
                  >
                      Apply
                  </Button>
              </TableCell>
          </TableRow>
      </TableHead>
    );
}

FilterRow.propTypes = {
    activeTab: PropTypes.string.isRequired,
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
    users: PropTypes.arrayOf(
      PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          name: PropTypes.string
      })
    ),
    refreshTasks: PropTypes.func.isRequired
};
