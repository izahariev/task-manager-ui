import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Box, IconButton, ListItem, ListItemButton, ListItemText, TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";

export default function UserRow({
    user,
    labelId,
    editedUser,
    editedUserNewName,
    setEditedUser,
    setEditedUserNewName,
    setErrorMessages,
    refreshUsers,
    handleSaveEdit,
    setDeleteUser,
    setDeleteUserError
}) {
    return (
      <ListItem
        key={user.id}
        secondaryAction={
            <UserRowSecondaryAction
              user={user}
              editedUser={editedUser}
              editedUserNewName={editedUserNewName}
              setEditedUser={setEditedUser}
              setEditedUserNewName={setEditedUserNewName}
              setErrorMessages={setErrorMessages}
              refreshUsers={refreshUsers}
              handleSaveEdit={handleSaveEdit}
              setDeleteUser={setDeleteUser}
              setDeleteUserError={setDeleteUserError}
            />
        }
        disablePadding
      >
          <ListItemButton>
              {editedUser == null ?
                <ListItemText
                  id={labelId}
                  primary={
                      <Typography variant="body1" sx={{fontWeight: 500}}>
                          {user.name}
                      </Typography>
                  }
                /> :
                <TextField
                  value={editedUserNewName}
                  onChange={(e) => setEditedUserNewName(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleSaveEdit({
                        editedUser,
                        editedUserNewName,
                        setEditedUser,
                        setEditedUserNewName,
                        setErrorMessages,
                        refreshUsers
                    })
                  }
                  variant="standard"
                  fullWidth
                  autoFocus
                  sx={{
                      "& .MuiInput-underline:before": {
                          borderBottomColor: "#5B7FA6"
                      },
                      "& .MuiInput-underline:hover:before": {
                          borderBottomColor: "#4A6B8F"
                      }
                  }}
                />
              }
          </ListItemButton>
      </ListItem>
    );
}

UserRow.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    labelId: PropTypes.string,
    editedUser: PropTypes.string,
    editedUserNewName: PropTypes.string,
    setEditedUser: PropTypes.func.isRequired,
    setEditedUserNewName: PropTypes.func.isRequired,
    setErrorMessages: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func,
    handleSaveEdit: PropTypes.func,
    setDeleteUser: PropTypes.func,
    setDeleteUserError: PropTypes.func
};

function UserRowSecondaryAction({
                                    user,
                                    editedUser,
                                    editedUserNewName,
                                    setEditedUser,
                                    setEditedUserNewName,
                                    setErrorMessages,
                                    refreshUsers,
                                    handleSaveEdit,
                                    setDeleteUser,
                                    setDeleteUserError
                                }) {
    return (
      <Box sx={{display: "flex", gap: "4px"}}>
          <IconButton
            sx={{
                backgroundColor: editedUser == null ? "#2196F3" : "#4CAF50",
                "&:hover": {
                    backgroundColor: editedUser == null ? "#1976D2" : "#45a049"
                },
                transition: "background-color 0.2s ease"
            }}
            size="small"
            onClick={() => {
                if (editedUser == null) {
                    setEditedUser(user.name);
                    setEditedUserNewName(user.name);
                    setErrorMessages([]);
                } else {
                    handleSaveEdit({
                        editedUser,
                        editedUserNewName,
                        setEditedUser,
                        setEditedUserNewName,
                        setErrorMessages,
                        refreshUsers
                    });
                }
            }}
            aria-label={editedUser == null ? `Edit ${user.name}` : "Save edit"}
          >
              {editedUser == null ?
                <EditIcon sx={{color: "white"}} fontSize="small"/> :
                <CheckIcon sx={{color: "white"}} fontSize="small"/>
              }
          </IconButton>
          <IconButton
            sx={{
                backgroundColor: editedUser == null ? "#F44336" : "#5B7FA6",
                "&:hover": {
                    backgroundColor: editedUser == null ? "#D32F2F" : "#4A6B8F"
                },
                transition: "background-color 0.2s ease"
            }}
            size="small"
            onClick={() => {
                if (editedUser == null) {
                    setDeleteUser(user);
                    setDeleteUserError(null);
                } else {
                    setEditedUser("");
                    setEditedUserNewName("");
                }
                setErrorMessages([]);
            }}
            aria-label={editedUser == null ? `Delete ${user.name}` : "Cancel edit"}
          >
              {editedUser == null ?
                <DeleteIcon sx={{color: "white"}} fontSize="small"/> :
                <CloseIcon sx={{color: "white"}} fontSize="small"/>
              }
          </IconButton>
      </Box>
    );
}

UserRowSecondaryAction.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    editedUser: PropTypes.string,
    editedUserNewName: PropTypes.string,
    setEditedUser: PropTypes.func.isRequired,
    setEditedUserNewName: PropTypes.func.isRequired,
    setErrorMessages: PropTypes.func.isRequired,
    refreshUsers: PropTypes.func,
    handleSaveEdit: PropTypes.func,
    setDeleteUser: PropTypes.func,
    setDeleteUserError: PropTypes.func
};