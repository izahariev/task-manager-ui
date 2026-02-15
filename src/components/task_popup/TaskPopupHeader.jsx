import CloseIcon from "@mui/icons-material/Close";
import {AppBar, Button, IconButton, Toolbar, Typography} from "@mui/material";
import PropTypes from "prop-types";

TaskPopupHeader.propTypes = {
    onClose: PropTypes.func.isRequired,
    readOnly: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onCompleteClick: PropTypes.func.isRequired,
    onEditClick: PropTypes.func.isRequired,
};

function TaskPopupHeader(props) {
    const {
        onClose,
        readOnly,
        isEdit,
        onSaveClick,
        onCompleteClick,
        onEditClick,
    } = props;

    return (
        <AppBar sx={{
            position: 'relative',
            backgroundColor: '#2D3748'
        }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onClose}
                    aria-label="close"
                >
                    <CloseIcon/>
                </IconButton>
                <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                    {readOnly ? 'Task Details' : isEdit ? 'Edit Task' : 'Add Task'}
                </Typography>
                {!readOnly && (
                    <Button color="inherit" onClick={onSaveClick}>
                        save
                    </Button>
                )}
                {readOnly ? (
                    <div>
                        <Button color="inherit" onClick={onCompleteClick}>
                            complete
                        </Button>
                        <Button color="inherit" onClick={onEditClick}>
                            edit
                        </Button>
                    </div>
                ) : null}
            </Toolbar>
        </AppBar>
    );
}

export default TaskPopupHeader;
