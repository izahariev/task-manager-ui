import CloseIcon from "@mui/icons-material/Close";
import {Box, IconButton, TextField} from "@mui/material";
import PropTypes from "prop-types";

export default function TitleFilter({titleFilterValue, setTitleFilterValue}) {
    return (
      <Box sx={{position: "relative", display: "flex", alignItems: "center"}}>
          <TextField
            id="title-filter"
            variant="outlined"
            fullWidth
            multiline
            minRows={1}
            maxRows={5}
            size="small"
            value={titleFilterValue}
            onChange={(event) => setTitleFilterValue(event.target.value)}
            placeholder="Search by title..."
            sx={{
                backgroundColor: "#FFFFFF",
                flex: 1,
                "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                        borderColor: "#CBD5E0"
                    },
                    "&:hover fieldset": {
                        borderColor: "#5B7FA6"
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#5B7FA6"
                    }
                }
            }}
          />
          {titleFilterValue && (
            <IconButton
              size="small"
              onClick={() => setTitleFilterValue("")}
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

TitleFilter.propTypes = {
    titleFilterValue: PropTypes.string.isRequired,
    setTitleFilterValue: PropTypes.func.isRequired
};
