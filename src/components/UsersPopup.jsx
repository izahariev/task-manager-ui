import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {Alert, Box, Divider, IconButton, TextField, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from "@mui/material/Paper";
import axios from "axios";
import * as React from 'react';
import {useUsers} from "../contexts/UsersContext.jsx";

export default function UsersPopup() {
    const {users, refreshUsers} = useUsers();
    const [newUser, setNewUser] = React.useState("");
    const [editedUser, setEditedUser] = React.useState("");
    const [editedUserNewName, setEditedUserNewName] = React.useState("");
    const [deleteUser, setDeleteUser] = React.useState("");
    const [errorMessages, setErrorMessages] = React.useState([]);

    React.useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    //TODO: Extract API call to BackendApis
    const handleAddUser = () => {
        if (newUser.trim() === '') {
            setErrorMessages(['Please enter a user name']);
            return;
        }
        axios.post('http://localhost:8080/users/create', null, {params: {name: newUser}})
          .then(() => {
              setNewUser("");
              refreshUsers().then(r => {
                  if (r.errors.length > 0) {
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
        axios.patch('http://localhost:8080/users/update', null, {
            params: {
                originalName: editedUser, newName: editedUserNewName
            }
        })
          .then(() => {
            refreshUsers().then(r => {
                if (r.errors.length > 0) {
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
        axios.delete('http://localhost:8080/users/remove', {params: {name: deleteUser}})
          .then(() => {
              refreshUsers().then(r => {
                  if (r.errors && r.errors.length > 0) {
                      setErrorMessages([...r.errors]);
                  } else {
                      setDeleteUser('');
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

    return (
      <Box sx={{
          width: '100%',
          bgcolor: '#F7FAFC',
          minHeight: '200px',
          padding: '16px'
      }}>
          {deleteUser !== "" &&
            <Alert 
                variant="filled" 
                severity="warning" 
                sx={{marginBottom: "16px"}}
                onClose={() => {
                    setDeleteUser("");
                    setErrorMessages([]);
                }}
            >
                <Typography variant="body2">
                    Click the red delete button to confirm deletion of user <strong>&#34;{deleteUser}&#34;</strong> or close this alert to cancel.
                </Typography>
            </Alert>
          }
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
                    bgcolor: '#FFFFFF',
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
                        const labelId = `checkbox-list-secondary-label-${user}`;
                        return (
                          <React.Fragment key={user}>
                              {user !== editedUser && user !== deleteUser &&
                                <ListItem
                                  key={user}
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
                                            size={"small"}
                                            onClick={() => {
                                                setEditedUser(user)
                                                setEditedUserNewName(user)
                                                setErrorMessages([])
                                            }}
                                            aria-label={`Edit ${user}`}
                                          >
                                              <EditIcon sx={{color: "white"}} fontSize={"small"}/>
                                          </IconButton>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#F44336",
                                                '&:hover': {
                                                    backgroundColor: '#D32F2F',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size={"small"}
                                            onClick={() => {
                                                setDeleteUser(user)
                                                setErrorMessages([])
                                            }}
                                            aria-label={`Delete ${user}`}
                                          >
                                              <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
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
                                                    {user}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                              }
                              {user === editedUser &&
                                <ListItem
                                  key={user}
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
                                            size={"small"}
                                            onClick={handleSaveEdit}
                                            aria-label="Save edit"
                                          >
                                              <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                                          </IconButton>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#5B7FA6",
                                                '&:hover': {
                                                    backgroundColor: '#4A6B8F',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size={"small"}
                                            onClick={() => {
                                                setEditedUser("")
                                                setEditedUserNewName("")
                                                setErrorMessages([])
                                            }}
                                            aria-label="Cancel edit"
                                          >
                                              <CloseIcon sx={{color: "white"}} fontSize={"small"}/>
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
                              {user === deleteUser &&
                                <ListItem
                                  key={user}
                                  secondaryAction={
                                      <Box sx={{display: 'flex', gap: '4px'}}>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#C85A5A",
                                                '&:hover': {
                                                    backgroundColor: '#B04848',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size={"small"}
                                            onClick={handleDeleteUserClick}
                                            aria-label="Confirm delete"
                                          >
                                              <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                                          </IconButton>
                                          <IconButton
                                            sx={{
                                                backgroundColor: "#5B7FA6",
                                                '&:hover': {
                                                    backgroundColor: '#4A6B8F',
                                                },
                                                transition: 'background-color 0.2s ease'
                                            }}
                                            size={"small"}
                                            onClick={() => {
                                                setDeleteUser("")
                                                setErrorMessages([])
                                            }}
                                            aria-label="Cancel delete"
                                          >
                                              <CloseIcon sx={{color: "white"}} fontSize={"small"}/>
                                          </IconButton>
                                      </Box>
                                  }
                                  sx={{
                                      backgroundColor: "#FFF3E0",
                                      '&:hover': {
                                          backgroundColor: "#FFE0B2"
                                      }
                                  }}
                                  disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemText 
                                            id={labelId} 
                                            primary={
                                                <Typography variant="body1" sx={{fontWeight: 500}}>
                                                    {user}
                                                </Typography>
                                            }
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
                    bgcolor: '#FFFFFF',
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
                  bgcolor: '#FFFFFF',
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
                        setDeleteUser("")
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
      </Box>
    );
}