import {Box, Checkbox} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import React from "react";
import {FixedSizeList} from "react-window";


function renderRow({index, style, data}) {
    const { users } = data;
    const [checked, setChecked] = React.useState([0]);

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
      <ListItem
        style={style}
        key={index}
        secondaryAction={
            <Checkbox
              edge="end"
              onChange={handleToggle(index)}
              checked={checked.includes(index)}
              inputProps={{ 'aria-labelledby': index }}
            />
        }
        disablePadding
      >
          <ListItemButton>
              <ListItemText id={index} primary={`${users[index]}`} />
          </ListItemButton>
      </ListItem>
    );
}

function AssigneesSection() {
    const users = ["Any", "Ivo", "Didka", "Ivo2"];

    return (
      <Grid container sx={{marginBottom: "2%"}}>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginRight: "1.5%",
              marginBottom: "3%"
          }}>
              <h2>Assignees</h2>
          </Grid>
          <Grid size={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              marginRight: "1.5%"
          }}>
              <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    border: '1px solid #ccc'
                }}
              >
                  <FixedSizeList
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={users.length}
                    itemData={{users}}
                    overscanCount={5}
                  >
                      {renderRow}
                  </FixedSizeList>
              </Box>
          </Grid>
      </Grid>
    )
}

export default AssigneesSection;