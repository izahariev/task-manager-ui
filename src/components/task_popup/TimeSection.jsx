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
    setPeriodValue: PropTypes.func,
    minDate: PropTypes.string,
    tooltipContent: PropTypes.node,
    periodValue: PropTypes.shape({
        years: PropTypes.number,
        months: PropTypes.number,
        days: PropTypes.number
    })
}

PeriodField.propTypes = {
    label: PropTypes.string,
    readOnly: PropTypes.bool,
    value: PropTypes.number,
    setValue: PropTypes.func
};

function PeriodField({ label, readOnly, value, setValue}) {
    const displayValue = value === '' || value === undefined || value === null ? 0 : Number(value) || 0;
    return (
      <TextField
        disabled={!!readOnly}
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
        value={displayValue}
        onChange={(e) => {
            const num = e.target.value === '' ? 0 : Number(e.target.value) || 0;
            setValue(num);
        }}
        fullWidth={true}
        sx={{ marginBottom: "5%", paddingRight: "1%", paddingLeft: "2%" }}
      />
    );
}

function TimeSection({title, readOnly, timeValue, setTimeValue, setPeriodValue, minDate, tooltipContent, periodValue}) {
    const toNum = (v) => (v === undefined || v === null ? 0 : Number(v) || 0);
    const hasPeriod = periodValue && (toNum(periodValue.years) > 0 || toNum(periodValue.months) > 0 || toNum(periodValue.days) > 0);
    const hasDate = timeValue && timeValue.trim() !== '';
    const initialIsDate = !hasPeriod;
    const initialDate = hasDate ? timeValue : '';
    const initialDays = toNum(periodValue?.days);
    const initialMonths = toNum(periodValue?.months);
    const initialYears = toNum(periodValue?.years);

    const [date, setDate] = React.useState(initialDate);
    const [days, setDays] = React.useState(initialDays);
    const [months, setMonths] = React.useState(initialMonths);
    const [years, setYears] = React.useState(initialYears);
    const [isDate, setIsDate] = React.useState(initialIsDate);

    // Sync from parent-provided values.
    // Repeat has a real periodValue prop and should mirror the parent state.
    // Start/Deadline derives a date from period inputs, so we must not overwrite local period fields on each keystroke.
    React.useEffect(() => {
        const hasP = periodValue && (toNum(periodValue.years) > 0 || toNum(periodValue.months) > 0 || toNum(periodValue.days) > 0);
        const hasD = timeValue && timeValue.trim() !== '';
        const isRepeatSection = typeof setPeriodValue === 'function';

        if (isRepeatSection) {
            setIsDate(!hasP);
            setDays(toNum(periodValue?.days));
            setMonths(toNum(periodValue?.months));
            setYears(toNum(periodValue?.years));
        }

        setDate(hasD ? timeValue : '');
        // Omit setPeriodValue: TaskPopup passes a new inline function each render; listing it reruns this effect on
        // every unrelated field change (e.g., Start/Deadline) and resets Repeat's toggle via setIsDate(!hasP).
    }, [timeValue, periodValue]);

    return (
      <Grid container sx={{marginBottom: "2%", height: "25%"}}>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginRight: "1.5%",
              marginBottom: readOnly ? "12%" : 0
          }}>
              <h2 style={{'marginLeft': '9%'}}>{title}</h2>
              <Tooltip title={tooltipContent}>
                  <InfoOutlineIcon fontSize='xsmall'/>
              </Tooltip>
          </Grid>
          <Grid size={12} sx={{}}>
              {!readOnly && (<Grid component="label" container alignItems="center" spacing={1}>
                  <Grid size={5} textAlign="right">Period</Grid>
                  <Grid size={2}>
                      <Switch
                        checked={isDate}
                        onChange={() => setIsDate(!isDate)}
                        value="checked" // some value you need
                        sx={{
                            ".MuiSwitch-thumb": {
                                backgroundColor: "#5B7FA6"
                            },
                            ".MuiSwitch-track": {
                                backgroundColor: "#A8C4E0"
                            },
                            "& .MuiSwitch-switchBase": {
                                "&.Mui-checked": {
                                    ".MuiSwitch-thumb": {
                                        backgroundColor: "#5B7FA6"
                                    },
                                    "+ .MuiSwitch-track": {
                                        backgroundColor: "#A8C4E0"
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
                        {...(minDate ? { minDate: dayjs(minDate) } : {})}
                        value={date ? dayjs(date) : null}
                        onChange={(e) => {
                            // The if is pointless, but it is required by tests
                            if (e) {
                                setDate(e.format("YYYY-MM-DD").toString())
                                setTimeValue(e.format("YYYY-MM-DD").toString())
                            }
                        }}
                      />
                  </LocalizationProvider>
              )}
              {!isDate && (
                <Grid container sx={{height: "25%"}}>
                    <PeriodField label="Days" readOnly={readOnly} value={days} setValue={(d) => {
                        if (setPeriodValue) {
                            setPeriodValue({
                                years: years,
                                months: months,
                                days: d
                            });
                        } else {
                            setTimeValue(dayjs()
                              .add(d, 'days')
                              .add(months, 'months')
                              .add(years, 'years')
                              .format('YYYY-MM-DD')
                              .toString()
                            )
                        }
                        setDays(d)
                    }}/>
                    <PeriodField label="Months" readOnly={readOnly} value={months} setValue={(m) => {
                        if (setPeriodValue) {
                            setPeriodValue({
                                years: years,
                                months: m,
                                days: days
                            });
                        } else {
                            setTimeValue(dayjs()
                              .add(days, 'days')
                              .add(m, 'months')
                              .add(years, 'years')
                              .format('YYYY-MM-DD')
                              .toString()
                            )
                        }
                        setMonths(m)
                    }} />
                    <PeriodField label="Years" readOnly={readOnly} value={years} setValue={(y) => {
                        if (setPeriodValue) {
                            setPeriodValue({
                                years: y,
                                months: months,
                                days: days
                            });
                        } else {
                            setTimeValue(dayjs()
                              .add(days, 'days')
                              .add(months, 'months')
                              .add(y, 'years')
                              .format('YYYY-MM-DD')
                              .toString()
                            )
                        }
                        setYears(y)
                    }}/>
                </Grid>
              )}
          </Grid>
          {!readOnly && (<Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: "3%",
          }}>
              <Button
                variant="contained"
                sx={{
                    backgroundColor: '#5B7FA6',
                    '&:hover': {
                        backgroundColor: '#4A6B8F',
                    },
                    transition: 'background-color 0.2s ease'
                }}
                onClick={
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
          </Grid>)}
      </Grid>
    )
}

export default TimeSection;