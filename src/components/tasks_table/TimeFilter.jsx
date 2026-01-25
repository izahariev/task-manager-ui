import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";
import {Box, IconButton, Tooltip} from "@mui/material";
import PropTypes from "prop-types";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default function TimeFilter({filterValue, setFilterValue, tooltip}) {
    return (
      <Box sx={{display: "flex", alignItems: "center"}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={filterValue}
                onChange={(newValue) => setFilterValue(newValue)}
                slotProps={{
                    textField: {
                        size: "small",
                        fullWidth: true,
                        sx: {
                            backgroundColor: "#FFFFFF",
                            flex: 1,
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#CBD5E0"
                                },
                                "&:hover fieldset": {
                                    borderColor: "#5B7FA6"
                                }
                            }
                        }
                    }
                }}
              />
          </LocalizationProvider>
          <Tooltip title={tooltip} arrow>
              <InfoIcon
                sx={{
                    marginLeft: 1,
                    color: "#718096",
                    fontSize: "1.2rem"
                }}
              />
          </Tooltip>
          {filterValue && (
            <IconButton
              size="small"
              onClick={() => setFilterValue(null)}
              sx={{
                  marginLeft: 1,
                  color: "#718096",
                  backgroundColor: "#F7FAFC",
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

TimeFilter.propTypes = {
    filterValue: PropTypes.any,
    setFilterValue: PropTypes.func.isRequired,
    tooltip: PropTypes.string.isRequired
};
