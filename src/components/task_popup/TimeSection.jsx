import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import {Switch, TextField, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React from "react";

TimeSection.propTypes = {
    title: PropTypes.string,
    readOnly: PropTypes.bool,
    timeValue: PropTypes.string,
    setTimeValue: PropTypes.func,
    tooltipContent: PropTypes.node
}

PeriodField.propTypes = {
    label: PropTypes.string,
    readOnly: PropTypes.bool,
    value: PropTypes.number,
    setValue: PropTypes.func
};

function PeriodField({ label, readOnly, value, setValue}) {
    return (
      <TextField
        {...(readOnly ? { disabled: true } : {})}
        id={`outlined-number-${label.toLowerCase()}`}
        label={label}
        type="number"
        slotProps={{
            inputLabel: {
                shrink: true
            },
            htmlInput: {
                min: 0
            }
        }}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        fullWidth={true}
        sx={{ marginBottom: "5%", paddingRight: "1%", paddingLeft: "2%" }}
        defaultValue={0}
      />
    );
}

function TimeSection({title, readOnly, timeValue, setTimeValue, tooltipContent}) {
    const [date, setDate] = React.useState(timeValue);
    const [days, setDays] = React.useState(0);
    const [months, setMonths] = React.useState(0);
    const [years, setYears] = React.useState(0);
    const [isDate, setIsDate] = React.useState(true)

    return (
      <Grid container sx={{marginBottom: "2%", height: "25%"}}>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginRight: "1.5%"
          }}>
              <h2 style={{'marginLeft': '9%'}}>{title}</h2>
              <Tooltip title={tooltipContent}>
                  <InfoOutlineIcon fontSize={'xsmall'} />
              </Tooltip>
          </Grid>
          <Grid size={12} sx={{}}>
              {!readOnly && (<Grid component="label" container alignItems="center" spacing={1}>
                  <Grid size={5} textAlign={"right"}>Period</Grid>
                  <Grid size={2}>
                      <Switch
                        checked={isDate}
                        onChange={() =>
                        {
                            if (isDate) {
                                if (days !== 0 || months !== 0 || years !== 0) {
                                    setTimeValue(dayjs()
                                      .add(days, 'days')
                                      .add(months, 'months')
                                      .add(years, 'years')
                                      .format('YYYY-MM-DD')
                                      .toString()
                                    )
                                } else {
                                    setTimeValue('')
                                }
                            } else {
                                setTimeValue(date === '' ? '' : dayjs(date).format('YYYY-MM-DD').toString())
                            }
                            setIsDate(!isDate)
                        }
                      }
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
                      <DatePicker
                        {...(readOnly ? { disabled: true } : {})}
                        value={date ? dayjs(date) : null}
                        onChange={(e) => {
                            setDate(e.format("YYYY-MM-DD").toString())
                            setTimeValue(e.format("YYYY-MM-DD").toString())
                        }}
                      />
                  </LocalizationProvider>
              )}
              {!isDate && (
                <Grid container sx={{height: "25%"}}>
                    <PeriodField label="Days" readOnly={readOnly} value={days} setValue={(d) => {
                        setTimeValue(dayjs()
                          .add(d, 'days')
                          .add(months, 'months')
                          .add(years, 'years')
                          .format('YYYY-MM-DD')
                          .toString()
                        )
                        setDays(d)
                    }}/>
                    <PeriodField label="Months" readOnly={readOnly} value={months} setValue={(m) => {
                        setTimeValue(dayjs()
                          .add(days, 'days')
                          .add(m, 'months')
                          .add(years, 'years')
                          .format('YYYY-MM-DD')
                          .toString()
                        )
                        setMonths(m)
                    }} />
                    <PeriodField label="Years" readOnly={readOnly} value={years} setValue={(y) => {
                        setTimeValue(dayjs()
                          .add(days, 'days')
                          .add(months, 'months')
                          .add(y, 'years')
                          .format('YYYY-MM-DD')
                          .toString()
                        )
                        setYears(y)
                    }}/>
                </Grid>
              )}
          </Grid>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: "3%",
          }}>
              <Button variant="contained" onClick={
                  () => {
                      if (title === "Start time") {
                          setTimeValue(dayjs().format('YYYY-MM-DD').toString())
                      } else {
                          setTimeValue('')
                      }

                      if (isDate && title === "Start time") {
                          setDate(dayjs().format('YYYY-MM-DD').toString())
                      } else {
                          setDate('')
                      }

                      if (!isDate) {
                          setDays(0)
                          setMonths(0)
                          setYears(0)
                      }
                  }
              }>
                  Reset
              </Button>
          </Grid>
      </Grid>
    )
}

export default TimeSection;