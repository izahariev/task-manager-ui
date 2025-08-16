import {FormControl, MenuItem, Select} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";

PrioritySection.propTypes = {
    priority: PropTypes.string,
    setPriority: PropTypes.func,
    readOnly: PropTypes.bool
}

function PrioritySection({priority, setPriority, readOnly}) {
    return (
      <Grid container sx={{marginBottom: "2%", height: "25%"}}>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: "15%"
          }}>
              <h2>Priority</h2>
          </Grid>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: "1%"
          }}>
              <FormControl sx={{m: 1, minWidth: 120}}>
                  <Select
                    {...(readOnly ? { disabled: true } : {})}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    displayEmpty
                    inputProps={{'aria-label': 'Without label'}}
                    size={"medium"}
                  >
                      <MenuItem value="P0">P0</MenuItem>
                      <MenuItem value="P1">P1</MenuItem>
                      <MenuItem value="P2">P2</MenuItem>
                      <MenuItem value="P3">P3</MenuItem>
                      <MenuItem value="P4">P4</MenuItem>
                  </Select>
              </FormControl>
          </Grid>
      </Grid>
    )
}

export default PrioritySection;