import {Box, Dialog, DialogTitle, Divider} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import {useUsers} from "../../contexts/UsersContext.jsx";
import {handleAddUser, handleDeleteUserClick, handleSaveEdit} from "../../js/UsersPopupFunctions.js";
import AddUserSection from "./AddUserSection.jsx";
import AlertSection from "./AlertSection.jsx";
import DeleteUserDialog from "./DeleteUserDialog.jsx";
import UsersListSection from "./UsersListSection.jsx";

export default function UsersPopup({open, onClose}) {
    const {refreshUsers} = useUsers();
    const [newUser, setNewUser] = React.useState("");
    const [editedUser, setEditedUser] = React.useState("");
    const [editedUserNewName, setEditedUserNewName] = React.useState("");
    const [deleteUser, setDeleteUser] = React.useState(null);
    const [deleteUserError, setDeleteUserError] = React.useState(null);
    const [errorMessages, setErrorMessages] = React.useState([]);

    React.useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth={"xs"}
        fullWidth={true}
        slotProps={{
            paper: {
                sx: {
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }
            }
        }}
      >
        <DialogTitle align={"center"} sx={{
            backgroundColor: "#2D3748",
            color: "#FFFFFF",
            fontWeight: 600
        }}>Users</DialogTitle>
        <Box sx={{
            width: '100%',
            backgroundColor: '#F7FAFC',
            minHeight: '200px',
            padding: '16px'
        }}>
          <AlertSection errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
          <UsersListSection
            editedUser={editedUser}
            editedUserNewName={editedUserNewName}
            setEditedUser={setEditedUser}
            setEditedUserNewName={setEditedUserNewName}
            setErrorMessages={setErrorMessages}
            setDeleteUser={setDeleteUser}
            setDeleteUserError={setDeleteUserError}
            handleSaveEdit={handleSaveEdit}
          />
          <Divider sx={{marginY: '16px'}} />
          <AddUserSection
            newUser={newUser}
            setNewUser={setNewUser}
            editedUser={editedUser}
            setEditedUser={setEditedUser}
            setErrorMessages={setErrorMessages}
            handleAddUser={handleAddUser}
          />
          <DeleteUserDialog
            deleteUser={deleteUser}
            deleteUserError={deleteUserError}
            setDeleteUser={setDeleteUser}
            setDeleteUserError={setDeleteUserError}
            setErrorMessages={setErrorMessages}
            handleDeleteUserClick={handleDeleteUserClick}
          />
        </Box>
      </Dialog>
    );
}

UsersPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};