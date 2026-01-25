import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import PropTypes from "prop-types";

export default function PriorityFilter({priorityFilterValue, setPriorityFilterValue}) {
    return (
      <Box sx={{position: "relative", display: "flex", alignItems: "center", gap: 1}}>
              <FormControl size="small" sx={{flex: 1}}>
                  <InputLabel id="priority-filter-label">Priority</InputLabel>
                  <Select
                    labelId="priority-filter-label"
                    id="priority-filter"
                    value={priorityFilterValue}
                    onChange={(event) => setPriorityFilterValue(event.target.value)}
                    label="Priority"
                    variant="outlined"
                    sx={{
                        backgroundColor: "#FFFFFF",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#CBD5E0"
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#5B7FA6"
                        }
                    }}
                  >
                      <MenuItem value="">All</MenuItem>
                      <MenuItem value="P0">P0</MenuItem>
                      <MenuItem value="P1">P1</MenuItem>
                      <MenuItem value="P2">P2</MenuItem>
                      <MenuItem value="P3">P3</MenuItem>
                      <MenuItem value="P4">P4</MenuItem>
                  </Select>
              </FormControl>
              {priorityFilterValue && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                      e.stopPropagation();
                      setPriorityFilterValue("");
                  }}
                  sx={{
                      color: "#718096",
                      flexShrink: 0,
                      "&:hover": {
                          color: "#2D3748",
                          backgroundColor: "rgba(0, 0, 0, 0.04)"
                      }
                  }}
                >
                    <CloseIcon fontSize="small"/>
                </IconButton>
              )}
          </Box>
    );
}

PriorityFilter.propTypes = {
    priorityFilterValue: PropTypes.string.isRequired,
    setPriorityFilterValue: PropTypes.func.isRequired
};
