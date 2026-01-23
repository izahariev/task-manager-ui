import {Button} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";

function ButtonsSection({onManageUsersClick, onAddTaskClick}) {
    return (
        <>
            <Grid size={6} sx={{
                display: 'flex',
                justifyContent: 'left',
            }}>
            </Grid>
            <Grid size={6} sx={{
                display: 'flex',
                justifyContent: 'right',
            }}>
                <Button
                    variant="contained"
                    sx={{
                        marginRight: '1%',
                        backgroundColor: '#5B7FA6',
                        '&:hover': {
                            backgroundColor: '#4A6B8F',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    onClick={onManageUsersClick}
                >
                    Manage Users
                </Button>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#5B7FA6',
                        '&:hover': {
                            backgroundColor: '#4A6B8F',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    onClick={onAddTaskClick}
                >
                    Add Task
                </Button>
            </Grid>
        </>
    );
}

ButtonsSection.propTypes = {
    onManageUsersClick: PropTypes.func.isRequired,
    onAddTaskClick: PropTypes.func.isRequired
};

export default ButtonsSection;

