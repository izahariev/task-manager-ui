import Grid from "@mui/material/Grid2";
import PropTypes from "prop-types";

TaskPopupSection.propTypes = {
    children: PropTypes.node.isRequired,
    size: PropTypes.number,
    marginBottom: PropTypes.string,
};

function TaskPopupSection(props) {
    const {children, size = 12, marginBottom = "1%"} = props;

    return (
        <Grid
            size={size}
            sx={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom
            }}
        >
            {children}
        </Grid>
    );
}

export default TaskPopupSection;
