import {Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from "prop-types";
import {useTasks} from "../../contexts/TasksContext.jsx";
import {useUsers} from "../../contexts/UsersContext.jsx";

export default function DeleteUserDialog({
    deleteUser,
    deleteUserError,
    setDeleteUser,
    setDeleteUserError,
    setErrorMessages,
    handleDeleteUserClick
}) {
    const {refreshUsers} = useUsers();
    const {refreshTasks} = useTasks();

    return (
      <Dialog
        open={deleteUser !== null}
        onClose={() => {
            setDeleteUser(null);
            setDeleteUserError(null);
        }}
      >
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>
              {deleteUserError && (
                <Alert
                  severity="error"
                  sx={{marginBottom: 2}}
                  onClose={() => setDeleteUserError(null)}
                >
                    {deleteUserError}
                </Alert>
              )}
              <DialogContentText>
                  Are you sure you want to delete user <strong>&#34;{deleteUser?.name}&#34;</strong>?
              </DialogContentText>
              <DialogContentText sx={{mt: 2, fontWeight: "bold", color: "#F44336"}}>
                  This action can not be reverted!
              </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button
                onClick={() => {
                    setDeleteUser(null);
                    setDeleteUserError(null);
                }}
                sx={{
                    color: "#5B7FA6",
                    "&:hover": {
                        backgroundColor: "#E0E7FF"
                    }
                }}
              >
                  Cancel
              </Button>
              <Button
                onClick={() =>
                  handleDeleteUserClick({
                      deleteUser,
                      setDeleteUser,
                      setDeleteUserError,
                      setErrorMessages,
                      refreshUsers,
                      refreshTasks
                  })
                }
                sx={{
                    backgroundColor: "#F44336",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#D32F2F"
                    },
                    transition: "background-color 0.2s ease"
                }}
                variant="contained"
              >
                  Delete
              </Button>
          </DialogActions>
      </Dialog>
    );
}

DeleteUserDialog.propTypes = {
    deleteUser: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string
    }),
    deleteUserError: PropTypes.string,
    setDeleteUser: PropTypes.func.isRequired,
    setDeleteUserError: PropTypes.func.isRequired,
    setErrorMessages: PropTypes.func.isRequired,
    handleDeleteUserClick: PropTypes.func.isRequired
};
