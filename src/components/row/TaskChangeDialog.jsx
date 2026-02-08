import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import {useErrors} from "../../contexts/ErrorMessagesContext.jsx";

TaskChangeDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    contentText: PropTypes.node.isRequired,
    warningText: PropTypes.node,
    cancelLabel: PropTypes.string,
    confirmLabel: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    confirmButtonSx: PropTypes.object.isRequired,
};

function TaskChangeDialog(props) {
    const {
        open,
        onClose,
        title,
        contentText,
        warningText,
        cancelLabel = "Cancel",
        confirmLabel,
        onConfirm,
        confirmButtonSx,
    } = props;
    const {addErrors, clearErrors} = useErrors();

    const handleConfirm = async () => {
        try {
            await onConfirm();
            clearErrors();
        } catch (error) {
            const messages = Array.isArray(error.response.data.errors) ?
              error.response.data.errors : "Error occurred";
            addErrors(messages);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {contentText}
                </DialogContentText>
                {warningText && (
                    <DialogContentText sx={{mt: 2, fontWeight: "bold", color: "#F44336"}}>
                        {warningText}
                    </DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    sx={{
                        color: "#5B7FA6",
                        "&:hover": {
                            backgroundColor: "#E0E7FF",
                        }
                    }}
                >
                    {cancelLabel}
                </Button>
                <Button
                    onClick={handleConfirm}
                    sx={{
                        ...confirmButtonSx,
                        color: "white",
                        transition: "background-color 0.2s ease"
                    }}
                    variant="contained"
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TaskChangeDialog;
