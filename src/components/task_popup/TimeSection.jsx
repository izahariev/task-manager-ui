import {Switch, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import PropTypes from "prop-types";
import React from "react";

TimeSection.propTypes = {
    title: PropTypes.string,
    readOnly: PropTypes.bool
}

PeriodField.propTypes = {
    label: PropTypes.string,
    readOnly: PropTypes.bool
};

function PeriodField({ label, readOnly}) {
    return (
      <TextField
        {...(readOnly ? { disabled: true } : {})}
        id={`outlined-number-${label.toLowerCase()}`}
        label={label}
        type="number"
        slotProps={{
            inputLabel: {
                shrink: true,
            },
        }}
        fullWidth={true}
        sx={{ marginBottom: "5%", paddingRight: "1%", paddingLeft: "2%" }}
        defaultValue={0}
      />
    );
}

function TimeSection({title, readOnly}) {
    const [isDate, setIsDate] = React.useState(true)

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
              {!readOnly && (<Grid component="label" container alignItems="center" spacing={1}>
                  <Grid size={5} textAlign={"right"}>Period</Grid>
                  <Grid size={2}>
                      <Switch
                        checked={isDate}
                        onChange={() => setIsDate(!isDate)}
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
                  <Grid size={4} marginLeft={"2%"}>Date</Grid>
              </Grid>)}
          </Grid>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: "3%",
          }}>
              {isDate && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker {...(readOnly ? { disabled: true } : {})}/>
                  </LocalizationProvider>
              )}
              {!isDate && (
                <Grid container sx={{height: "25%"}}>
                    <PeriodField label="Days" readOnly={readOnly} />
                    <PeriodField label="Months" readOnly={readOnly} />
                    <PeriodField label="Years" readOnly={readOnly} />
                </Grid>
              )}
          </Grid>
      </Grid>
    )
}

export default TimeSection;