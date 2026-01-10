import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {Alert, IconButton, Input, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
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

    //TODO: Extract API call to BackendApis
    const handleAddUser = () => {
        if (newUser.trim() === '') {
            setErrorMessages(['Please enter a user name']);
            return;
        }
        axios.post('http://localhost:8080/users/create', null, {params: {name: newUser}})
          .then(() => {
              refreshUsers().then(r => {
                  if (r.errors.length > 0) {
                      setErrorMessages([...r.errors]);
                  } else {
                      setNewUser("");
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
                  if (r.errors.length > 0) {
                      setErrorMessages([...r.errors]);
                  } else {
                      setDeleteUser('');
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
      <List dense sx={{
          width: '100%',
          bgcolor: '#F7FAFC',
          minHeight: '200px'
      }}>
          {deleteUser !== "" &&
            <Alert variant="filled" severity="info" sx={{marginBottom: "2%"}}>
                <Grid container>
                    <Grid size={12} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            Click the red bin button to confirm delete of user &#34;{deleteUser}&#34;
                            or the blue X to cancel
                        </div>
                    </Grid>
                </Grid>
            </Alert>
          }
          {users.map((user) => {
              const labelId = `checkbox-list-secondary-label-${user}`;
              return (
                <React.Fragment key={user}>
                    {user !== editedUser && user !== deleteUser &&
                      <ListItem
                        key={user}
                        secondaryAction={
                            <Grid container spacing={0.5}>
                                <Grid size={6}>
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
                                    >
                                        <EditIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                                <Grid size={6}>
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
                                    >
                                        <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        }
                        disablePadding
                      >
                          <ListItemButton>
                              <ListItemText id={labelId} primary={`${user}`}/>
                          </ListItemButton>
                      </ListItem>
                    }
                    {user === editedUser &&
                      <ListItem
                        key={user}
                        secondaryAction={
                            <Grid container spacing={0.5}>
                                <Grid size={6}>
                                    <IconButton
                                      sx={{
                                          backgroundColor: "#5B7FA6",
                                          '&:hover': {
                                              backgroundColor: '#4A6B8F',
                                          },
                                          transition: 'background-color 0.2s ease'
                                      }}
                                      size={"small"}
                                      onClick={handleSaveEdit}
                                    >
                                        <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                                <Grid size={6}>
                                    <IconButton
                                      sx={{
                                          backgroundColor: "#5B7FA6",
                                          '&:hover': {
                                              backgroundColor: '#4A6B8F',
                                          },
                                          transition: 'background-color 0.2s ease'
                                      }}
                                      size={"small"}
                                      onClick={() => setEditedUser("")}
                                    >
                                        <CloseIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        }
                        disablePadding
                      >
                          <ListItemButton>
                              <Input
                                value={editedUserNewName}
                                onChange={(e) => setEditedUserNewName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                              />
                          </ListItemButton>
                      </ListItem>
                    }
                    {user === deleteUser &&
                      <ListItem
                        key={user}
                        secondaryAction={
                            <Grid container spacing={0.5}>
                                <Grid size={6}>
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
                                    >
                                        <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                                <Grid size={6}>
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
                                      }}
                                    >
                                        <CloseIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        }
                        sx={{
                            backgroundColor: "#EDF2F7",
                            '&:hover': {
                                backgroundColor: "#E2E8F0"
                            }
                        }}
                        disablePadding
                      >
                          <ListItemButton>
                              <ListItemText id={labelId} primary={`${user}`}/>
                          </ListItemButton>
                      </ListItem>
                    }
                </React.Fragment>
              );
          })}
          <TextField
            label="Username"
            variant="standard"
            sx={{marginLeft: "4%", width: "69%"}}
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
          />
          <Button
            variant="contained"
            sx={{
                marginTop: "3%",
                marginLeft: "2%",
                backgroundColor: '#5B7FA6',
                '&:hover': {
                    backgroundColor: '#4A6B8F',
                },
                transition: 'background-color 0.2s ease'
            }}
            onClick={handleAddUser}
          >
              Add User
          </Button>
          {errorMessages.length !== 0 &&
            <Alert variant="filled" severity="error" sx={{marginTop: '2%'}}>
                <Grid container>
                    <Grid size={12} sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                        <div style={{display: 'flex', justifyContent: 'space-around'}}>
                            <ul style={{flexGrow: '0', listStyleType: 'none'}}>
                                {errorMessages && errorMessages.map((errorMessage, index) => (<li key={index}>
                                    {errorMessage}
                                </li>))}
                            </ul>
                        </div>
                    </Grid>
                </Grid>
            </Alert>
          }
      </List>
    );
}