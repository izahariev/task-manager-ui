import {Alert, Box, Fade} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";

function CustomAlert({taskChangedMessage, showAlert, setShowAlert, setTaskChangedMessage, errorMessages, clearErrors}) {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: '1%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1400,
                width: '100%',
                maxWidth: 'xl'
            }}
        >
            {taskChangedMessage !== null &&
                <Fade in={showAlert} timeout={500}>
                    <Alert
                        variant="filled"
                        severity="success"
                        sx={{marginBottom: '1%'}}
                        onClose={() => {
                            setShowAlert(false);
                            setTimeout(() => {
                                setTaskChangedMessage(null);
                            }, 500);
                        }}
                    >
                        <Grid container>
                            <Grid size={12} sx={{
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <div className="alert-content">
                                    {taskChangedMessage}
                                </div>
                            </Grid>
                        </Grid>
                    </Alert>
                </Fade>
            }
            {errorMessages.length !== 0 &&
                <Alert variant="filled" severity="error" onClose={clearErrors} sx={{marginBottom: '1%'}}>
                    <Grid container>
                        <Grid size={12} sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}>
                            <div className="alert-content">
                                <ul style={{flexGrow: '0', listStyleType: 'none'}}>
                                    {errorMessages && errorMessages.map((errorMessage, index) => (
                                        <li key={index}>
                                            {errorMessage}
                                        </li>))}
                                </ul>
                            </div>
                        </Grid>
                    </Grid>
                </Alert>
            }
        </Box>
    );
}

CustomAlert.propTypes = {
    taskChangedMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
    showAlert: PropTypes.bool,
    setShowAlert: PropTypes.func,
    setTaskChangedMessage: PropTypes.func,
    errorMessages: PropTypes.arrayOf(PropTypes.string),
    clearErrors: PropTypes.func
};

export default CustomAlert;

