import {createUser, deleteUser as deleteUserApi, updateUser} from "./BackendApis.js";

export function handleAddUser({newUser, setNewUser, setErrorMessages, refreshUsers}) {
    if (newUser.trim() === "") {
        setErrorMessages(["Please enter a user name"]);
        return;
    }

    createUser(newUser)
      .then(() => {
          setNewUser("");
          refreshUsers().then((r) => {
              if (r.errors && r.errors.length > 0) {
                  setErrorMessages([...r.errors]);
              } else {
                  setErrorMessages([]);
              }
          });
      })
      .catch((error) => {
          const errors = [];
          error.response.data["errors"].forEach((err) => {
              errors.push(err["description"]);
          });
          setErrorMessages([...errors]);
      });
}

export function handleSaveEdit({
    editedUser,
    editedUserNewName,
    setEditedUser,
    setEditedUserNewName,
    setErrorMessages,
    refreshUsers
}) {
    updateUser(editedUser, editedUserNewName)
      .then(() => {
          refreshUsers().then((r) => {
              if (r.errors && r.errors.length > 0) {
                  setErrorMessages([...r.errors]);
              } else {
                  setEditedUser("");
                  setEditedUserNewName("");
                  setErrorMessages([]);
              }
          });
      })
      .catch((error) => {
          const errors = [];
          error.response.data["errors"].forEach((err) => {
              errors.push(err["description"]);
          });
          setErrorMessages([...errors]);
      });
}

export function handleDeleteUserClick({
    deleteUser,
    setDeleteUser,
    setDeleteUserError,
    setErrorMessages,
    refreshUsers,
    refreshTasks
}) {
    deleteUserApi(deleteUser.id)
      .then(() => {
          refreshUsers().then((r) => {
              if (r.errors && r.errors.length > 0) {
                  setDeleteUserError(r.errors.join(", "));
              } else {
                  setDeleteUser(null);
                  setDeleteUserError(null);
                  setErrorMessages([]);
                  refreshTasks();
              }
          });
      })
      .catch((error) => {
          const errorMessage = error.response?.data?.errors
            ? error.response.data.errors.map((e) => e.description).join(", ")
            : "An error occurred while deleting the user";
          setDeleteUserError(errorMessage);
      });
}

