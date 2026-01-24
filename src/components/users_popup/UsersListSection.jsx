import {List, Paper, Typography} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import {useUsers} from "../../contexts/UsersContext.jsx";
import UserRow from "./UserRow.jsx";

export default function UsersListSection({
    editedUser,
    editedUserNewName,
    setEditedUser,
    setEditedUserNewName,
    setErrorMessages,
    setDeleteUser,
    setDeleteUserError,
    handleSaveEdit
}) {
    const {users, refreshUsers} = useUsers();

    if (!users || users.length === 0) {
        return(
          <Paper
            elevation={0}
            sx={{
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '16px',
                textAlign: 'center'
            }}
          >
              <Typography variant="body2" color="text.secondary">
                  No users found. Add your first user below.
              </Typography>
          </Paper>
        );
    }

    // noinspection JSValidateTypes
    return (
      <Paper
        elevation={0}
        sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            marginBottom: "16px",
            overflow: "hidden",
            maxHeight: "400px",
            display: "flex",
            flexDirection: "column"
        }}
      >
          <List
            dense
            sx={{
                overflowY: "auto",
                overflowX: "hidden",
                flex: 1
            }}
          >
              {users.map((user) => {
                  const labelId = `checkbox-list-secondary-label-${user.id}`;
                  return (
                    <React.Fragment key={user.id}>
                        {user.name !== editedUser && (
                          <UserRow
                            user={user}
                            labelId={labelId}
                            setEditedUser={setEditedUser}
                            setEditedUserNewName={setEditedUserNewName}
                            setErrorMessages={setErrorMessages}
                            setDeleteUser={setDeleteUser}
                            setDeleteUserError={setDeleteUserError}
                          />
                        )}
                        {user.name === editedUser && (
                          <UserRow
                            user={user}
                            editedUser={editedUser}
                            editedUserNewName={editedUserNewName}
                            setEditedUser={setEditedUser}
                            setEditedUserNewName={setEditedUserNewName}
                            setErrorMessages={setErrorMessages}
                            refreshUsers={refreshUsers}
                            handleSaveEdit={handleSaveEdit}
                          />
                        )}
                    </React.Fragment>
                  );
              })}
          </List>
      </Paper>
    );
}

UsersListSection.propTypes = {
    editedUser: PropTypes.string.isRequired,
    editedUserNewName: PropTypes.string.isRequired,
    setEditedUser: PropTypes.func.isRequired,
    setEditedUserNewName: PropTypes.func.isRequired,
    setErrorMessages: PropTypes.func.isRequired,
    setDeleteUser: PropTypes.func.isRequired,
    setDeleteUserError: PropTypes.func.isRequired,
    handleSaveEdit: PropTypes.func.isRequired
};

