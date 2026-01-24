import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
    Alert,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import React from "react";
import {useTasks} from "../contexts/TasksContext.jsx";
import {useUsers} from "../contexts/UsersContext.jsx";
import {createUser, deleteUser as deleteUserApi, updateUser} from "../js/BackendApis.js";

export default function UsersPopup({open, onClose}) {
    const {users, refreshUsers} = useUsers();
    const {refreshTasks} = useTasks();
    const [newUser, setNewUser] = React.useState("");
    const [editedUser, setEditedUser] = React.useState("");
    const [editedUserNewName, setEditedUserNewName] = React.useState("");
    const [deleteUser, setDeleteUser] = React.useState(null);
    const [deleteUserError, setDeleteUserError] = React.useState(null);
    const [errorMessages, setErrorMessages] = React.useState([]);

    React.useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const handleAddUser = () => {
        if (newUser.trim() === '') {
            setErrorMessages(['Please enter a user name']);
            return;
        }
        createUser(newUser)
          .then(() => {
              setNewUser("");
              refreshUsers().then(r => {
                  if (r.errors && r.errors.length > 0) {
                      setErrorMessages([...r.errors]);
                  } else {
                      setErrorMessages([]);
                  }
              });
          })
          .catch(error => {
              const errors = []
              error.response.data['errors'].forEach((error) => {
                  errors.push(error['description']);
              })
              setErrorMessages([...errors]);
          });
    };

    const handleSaveEdit = () => {
        updateUser(editedUser, editedUserNewName)
          .then(() => {
            refreshUsers().then(r => {
                if (r.errors && r.errors.length > 0) {
                    setErrorMessages([...r.errors]);
                } else {
                    setEditedUser("");
                    setEditedUserNewName("");
                    setErrorMessages([]);
                }
            });
        })
          .catch(error => {
              const errors = []
              error.response.data['errors'].forEach((error) => {
                  errors.push(error['description']);
              })
              setErrorMessages([...errors]);
          });
    };

    const handleDeleteUserClick = () => {
        deleteUserApi(deleteUser.id)
          .then(() => {
              refreshUsers().then(r => {
                  if (r.errors && r.errors.length > 0) {
                      setDeleteUserError(r.errors.join(', '));
                  } else {
                      setDeleteUser(null);
                      setDeleteUserError(null);
                      setErrorMessages([]);
                      refreshTasks();
                  }
              });
          })
          .catch(error => {
              const errorMessage = error.response?.data?.errors
                ? error.response.data.errors.map((e) => e.description).join(', ')
                : 'An error occurred while deleting the user';
              setDeleteUserError(errorMessage);
          });
    };

    // noinspection JSValidateTypes
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
          {errorMessages.length !== 0 &&
            <Alert 
                variant="filled" 
                severity="error" 
                sx={{marginBottom: '16px'}}
                onClose={() => setErrorMessages([])}
            >
                <Box>
                    {errorMessages.map((errorMessage, index) => (
                        <Typography key={index} variant="body2" sx={{marginBottom: index < errorMessages.length - 1 ? '4px' : 0}}>
                            {errorMessage}
                        </Typography>
                    ))}
                </Box>
            </Alert>
          }
          {users.length > 0 && (
            <Paper 
                elevation={0} 
                sx={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    overflow: 'hidden',
                    maxHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <List 
                    dense
                    sx={{
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        flex: 1
                    }}
                >
                    {users.map((user) => {
                        const labelId = `checkbox-list-secondary-label-${user.id}`;
                        return (
                          <React.Fragment key={user.id}>
                              {user.name !== editedUser &&
                                <ListItem
                                  key={user.id}
                                  secondaryAction={
                                      <Box sx={{display: 'flex', gap: '4px'}}>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#2196F3",
                                                '&:hover': {
                                                    backgroundColor: '#1976D2',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size="small"
                                            onClick={() => {
                                                setEditedUser(user.name)
                                                setEditedUserNewName(user.name)
                                                setErrorMessages([])
                                            }}
                                            aria-label={`Edit ${user.name}`}
                                          >
                                              <EditIcon sx={{color: "white"}} fontSize="small"/>
                                          </IconButton>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#F44336",
                                                '&:hover': {
                                                    backgroundColor: '#D32F2F',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size="small"
                                            onClick={() => {
                                                setDeleteUser(user)
                                                setDeleteUserError(null)
                                                setErrorMessages([])
                                            }}
                                            aria-label={`Delete ${user.name}`}
                                          >
                                              <DeleteIcon sx={{color: "white"}} fontSize="small"/>
                                          </IconButton>
                                      </Box>
                                  }
                                  disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemText 
                                            id={labelId} 
                                            primary={
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {user.name}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                              }
                              {user.name === editedUser &&
                                <ListItem
                                  key={user.id}
                                  secondaryAction={
                                      <Box sx={{display: 'flex', gap: '4px'}}>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#4CAF50",
                                                '&:hover': {
                                                    backgroundColor: '#45a049',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size="small"
                                            onClick={handleSaveEdit}
                                            aria-label="Save edit"
                                          >
                                              <CheckIcon sx={{color: "white"}} fontSize="small"/>
                                          </IconButton>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#5B7FA6",
                                                '&:hover': {
                                                    backgroundColor: '#4A6B8F',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size="small"
                                            onClick={() => {
                                                setEditedUser("")
                                                setEditedUserNewName("")
                                                setErrorMessages([])
                                            }}
                                            aria-label="Cancel edit"
                                          >
                                              <CloseIcon sx={{color: "white"}} fontSize="small"/>
                                          </IconButton>
                                      </Box>
                                  }
                                  disablePadding
                                >
                                    <ListItemButton>
                                        <TextField
                                            value={editedUserNewName}
                                            onChange={(e) => setEditedUserNewName(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                                            variant="standard"
                                            fullWidth
                                            autoFocus
                                            sx={{
                                                '& .MuiInput-underline:before': {
                                                    borderBottomColor: '#5B7FA6',
                                                },
                                                '& .MuiInput-underline:hover:before': {
                                                    borderBottomColor: '#4A6B8F',
                                                },
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                              }
                          </React.Fragment>
                        );
                    })}
                </List>
            </Paper>
          )}
          
          {users.length === 0 && (
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
          )}
          
          <Divider sx={{marginY: '16px'}} />
          
          <Paper 
              elevation={0} 
              sx={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '16px'
              }}
          >
              <Typography variant="subtitle2" sx={{marginBottom: '12px', fontWeight: 600, color: '#2D3748'}}>
                  Add New User
              </Typography>
              <Box sx={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    size="small"
                    onChange={(e) => setNewUser(e.target.value)}
                    onClick={() => {
                        if (editedUser !== "") {
                            setErrorMessages([])
                        }
                        setEditedUser("")
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                    value={newUser}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': {
                                borderColor: '#5B7FA6',
                            },
                        },
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    sx={{
                        backgroundColor: '#5B7FA6',
                        '&:hover': {
                            backgroundColor: '#4A6B8F',
                        },
                        transition: 'background-color 0.2s ease',
                        minWidth: '120px',
                        whiteSpace: 'nowrap'
                    }}
                    onClick={handleAddUser}
                  >
                      Add User
                  </Button>
              </Box>
          </Paper>
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
                      <Alert severity="error" sx={{marginBottom: 2}} onClose={() => setDeleteUserError(null)}>
                          {deleteUserError}
                      </Alert>
                  )}
                  <DialogContentText>
                      Are you sure you want to delete user <strong>&#34;{deleteUser?.name}&#34;</strong>?
                  </DialogContentText>
                  <DialogContentText sx={{mt: 2, fontWeight: 'bold', color: '#F44336'}}>
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
                        color: '#5B7FA6',
                        '&:hover': {
                            backgroundColor: '#E0E7FF',
                        }
                    }}
                  >
                      Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteUserClick}
                    sx={{
                        backgroundColor: '#F44336',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: '#D32F2F',
                        },
                        transition: 'background-color 0.2s ease'
                    }}
                    variant="contained"
                  >
                      Delete
                  </Button>
              </DialogActions>
          </Dialog>
        </Box>
      </Dialog>
    );
}

UsersPopup.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};