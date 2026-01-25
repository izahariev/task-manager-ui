import CloseIcon from "@mui/icons-material/Close";
import {
    Box,
    Checkbox,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select
} from "@mui/material";
import PropTypes from "prop-types";

export default function AssigneesFilter({
    assigneesFilterValues,
    setAssigneesFilterValues,
    users
}) {
    // noinspection JSValidateTypes
    return (<Box sx={{position: "relative", display: "flex", alignItems: "center", gap: 1}}>
          <FormControl size="small" sx={{flex: 1}}>
              <InputLabel id="assignees-filter-label">Assignees</InputLabel>
              <Select
                labelId="assignees-filter-label"
                id="assignees-filter"
                multiple
                value={assigneesFilterValues}
                onChange={(event) => {
                    const value = event.target.value;
                    setAssigneesFilterValues(typeof value === "string" ? value.split(",") : value);
                }}
                input={<OutlinedInput label="Assignees"/>}
                variant="outlined"
                renderValue={(selected) => selected.length > 0 ? `${selected.length} selected` : "All"}
                sx={{
                    backgroundColor: "#FFFFFF", "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#CBD5E0"
                    }, "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#5B7FA6"
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 300
                        }
                    }
                }}
              >
                  {users && Array.isArray(users) && users.length > 0 ?
                    ([...users].sort((a, b) => {
                          const aSelected = assigneesFilterValues.includes(a.name);
                          const bSelected = assigneesFilterValues.includes(b.name);
                          if (aSelected && !bSelected) return -1;
                          if (!aSelected && bSelected) return 1;
                          return String(a.name).localeCompare(String(b.name));
                      })
                      .map((user) => (<MenuItem key={user.id} value={user.name}>
                            <Checkbox
                              checked={assigneesFilterValues.includes(user.name)}
                              sx={{
                                  color: "#5B7FA6", "&.Mui-checked": {
                                      color: "#5B7FA6"
                                  }
                              }}
                            />
                            <ListItemText primary={user.name}/>
                        </MenuItem>))
                    ) :
                    <MenuItem disabled>No users available</MenuItem>
                  }
              </Select>
          </FormControl>
          {assigneesFilterValues.length > 0 && (<IconButton
              size="small"
              onClick={(e) => {
                  e.stopPropagation();
                  setAssigneesFilterValues([]);
              }}
              sx={{
                  color: "#718096", flexShrink: 0, "&:hover": {
                      color: "#2D3748", backgroundColor: "rgba(0, 0, 0, 0.04)"
                  }
              }}
            >
                <CloseIcon fontSize="small"/>
            </IconButton>)}
      </Box>);
}

AssigneesFilter.propTypes = {
    assigneesFilterValues: PropTypes.arrayOf(PropTypes.string).isRequired,
    setAssigneesFilterValues: PropTypes.func.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), name: PropTypes.string
    }))
};
