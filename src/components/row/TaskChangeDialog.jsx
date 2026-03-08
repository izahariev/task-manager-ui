import {Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel} from "@mui/material";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import React from "react";
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
    showDisableRepeatCheckbox: PropTypes.bool,
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
        showDisableRepeatCheckbox = false,
    } = props;
    const {addErrors, clearErrors} = useErrors();
    const [disableRepeat, setDisableRepeat] = React.useState(false);

    React.useEffect(() => {
        if (!open) {
            setDisableRepeat(false);
        }
    }, [open]);

    const handleConfirm = async () => {
        try {
            const confirmData = showDisableRepeatCheckbox ? { disableRepeat } : {};
            await onConfirm(confirmData);
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
                {showDisableRepeatCheckbox && (
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={disableRepeat}
                                onChange={(e) => setDisableRepeat(e.target.checked)}
                            />
                        }
                        label="Disable repeat"
                        sx={{mt: 2, display: "block"}}
                    />
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
