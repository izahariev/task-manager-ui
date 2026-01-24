import {Alert, Box, Typography} from "@mui/material";
import PropTypes from "prop-types";

/**
 * @param {{ errorMessages: string[]; setErrorMessages: (value: string[]) => void }} props
 */
export default function AlertSection({errorMessages, setErrorMessages}) {
    if (!errorMessages || errorMessages.length === 0) {
        return null;
    }

    // noinspection JSValidateTypes
    return (
      <Alert
        variant="filled"
        severity="error"
        sx={{marginBottom: "16px"}}
        onClose={() => setErrorMessages([])}
      >
          <Box>
              {errorMessages.map((errorMessage, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{marginBottom: index < errorMessages.length - 1 ? "4px" : 0}}
                >
                    {errorMessage}
                </Typography>
              ))}
          </Box>
      </Alert>
    );
}

AlertSection.propTypes = {
    errorMessages: PropTypes.arrayOf(PropTypes.string).isRequired,
    setErrorMessages: PropTypes.func.isRequired
};

