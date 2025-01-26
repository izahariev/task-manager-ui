import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {IconButton, Input} from "@mui/material";
import Grid from "@mui/material/Grid2";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import PropTypes from "prop-types";
import * as React from 'react';

UsersPopup.propTypes = {
    editedUser: PropTypes.string,
    setEditedUser: PropTypes.func,
}

export default function UsersPopup(props) {
    const {editedUser, setEditedUser} = props;
    const [checked, setChecked] = React.useState([1]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
      <List dense sx={{width: '100%', bgcolor: '#A6A6A6'}}>
          {["0", "1", "2", "3"].map((element) => {
              const labelId = `checkbox-list-secondary-label-${element}`;
              return (
                <React.Fragment key={element}>
                    {element !== editedUser &&
                      <ListItem
                        key={element}
                        secondaryAction={
                            <Grid container spacing={0.5}>
                                <Grid item size={6}>
                                    <IconButton
                                      sx={{backgroundColor: "#1976d2"}}
                                      size={"small"}
                                      onClick={() => setEditedUser(element)}
                                    >
                                        <EditIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                                <Grid item size={6}>
                                    <IconButton
                                      sx={{backgroundColor: "#1976d2"}}
                                      size={"small"}
                                    >
                                        <DeleteIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        }
                        disablePadding
                      >
                          <ListItemButton>
                              <ListItemText id={labelId} primary={`Line item ${element}`}/>
                          </ListItemButton>
                      </ListItem>
                    }
                    {element === editedUser &&
                      <ListItem
                        key={element}
                        secondaryAction={
                            <Grid container spacing={0.5}>
                                <Grid item size={6}>
                                    <IconButton
                                      sx={{backgroundColor: "#1976d2"}}
                                      size={"small"}
                                      onClick={() => setEditedUser("")}
                                    >
                                        <CheckIcon sx={{color: "white"}} fontSize={"small"}/>
                                    </IconButton>
                                </Grid>
                                <Grid item size={6}>
                                    <IconButton
                                      sx={{backgroundColor: "#1976d2"}}
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
                              <Input defaultValue="Hello world"/>
                          </ListItemButton>
                      </ListItem>
                    }
                </React.Fragment>
              );
          })}
      </List>
    );
}