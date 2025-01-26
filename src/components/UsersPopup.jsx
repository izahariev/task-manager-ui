import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {IconButton} from "@mui/material";
import Grid from "@mui/material/Grid2";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';

export default function UsersPopup() {
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
          {[0, 1, 2, 3].map((value) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <ListItem
                  key={value}
                  secondaryAction={
                      <Grid container spacing={0.5}>
                          <Grid item size={6}>
                              <IconButton
                                sx={{backgroundColor: "#1976d2"}}
                                size={"small"}
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
                        <ListItemText id={labelId} primary={`Line item ${value + 1}`}/>
                    </ListItemButton>
                </ListItem>
              );
          })}
      </List>
    );
}