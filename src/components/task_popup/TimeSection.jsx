import {Switch} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";

TimeSection.propTypes = {
    title: PropTypes.string,
}

function TimeSection({title}) {
    return (
      <Grid container sx={{marginBottom: "2%", height: "25%"}}>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginRight: "1.5%"
          }}>
              <h2>{title}</h2>
          </Grid>
          <Grid size={12} sx={{}}>
              <Grid component="label" container alignItems="center" spacing={1}>
                  <Grid size={5} textAlign={"right"}>Date</Grid>
                  <Grid size={2}>
                      <Switch
                        // checked={state.checked} // relevant state for your case
                        // onChange={handleChange} // relevant method to handle your change
                        value="checked" // some value you need
                        sx={{
                            ".MuiSwitch-thumb": {
                                backgroundColor: "#1976d2"
                            },
                            ".MuiSwitch-track": {
                                backgroundColor: "#8cbae8"
                            },
                            "& .MuiSwitch-switchBase": {
                                "&.Mui-checked": {
                                    ".MuiSwitch-thumb": {
                                        backgroundColor: "#1976d2"
                                    },
                                    "+ .MuiSwitch-track": {
                                        backgroundColor: "#8cbae8"
                                    }
                                }
                            }
                        }}
                      />
                  </Grid>
                  <Grid size={4} marginLeft={"2%"}>Period</Grid>
              </Grid>
          </Grid>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: "3%",
          }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker />
              </LocalizationProvider>
          </Grid>
      </Grid>
    )
}

export default TimeSection;