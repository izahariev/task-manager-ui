import {Box, Checkbox} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import PropTypes from "prop-types";
import React from "react";
import {FixedSizeList} from "react-window";


function renderRow({index, style, data}) {
    const { users, readOnly, checked, handleToggle } = data;

    return (
      <ListItem
        style={style}
        key={index}
        secondaryAction={
            <Checkbox
              {...(readOnly ? { disabled: true } : {})}
              edge="end"
              onChange={handleToggle(index)}
              checked={checked.includes(index)}
              slotProps={{
                  input: {
                      'aria-labelledby': index
                  }
              }}
            />
        }
        disablePadding
        sx={{backgroundColor: checked.includes(index) ? "#aecce4" : ""}}
      >
          <ListItemButton>
              <ListItemText id={index} primary={`${users[index]}`} />
          </ListItemButton>
      </ListItem>
    );
}

AssigneesSection.propTypes = {
    readOnly: PropTypes.bool,
    users: PropTypes.array,
    assignees: PropTypes.array,
    setAssignees: PropTypes.func
}

function AssigneesSection({readOnly, users, assignees, setAssignees}) {
    const [checked, setChecked] = React.useState([0]);

    React.useEffect(() => {
        if (!assignees || assignees.length === 0) {
            setChecked([0]);
        } else {
            const indexes = assignees
              .map(a => users.indexOf(a))
              .filter(i => i !== -1);

            setChecked(indexes.length > 0 ? indexes : [0]);
        }
    }, [users, assignees]);

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        let newChecked = [...checked];

        if (currentIndex === -1) {
            if (value === 0) {
                newChecked = [0]
                setAssignees([])
            } else {
                if (newChecked.indexOf(0) !== -1) {
                    newChecked.splice(0, 1);
                }
                newChecked.push(value);
                const tmpAssignees = assignees;
                tmpAssignees.push(users[value])
                setAssignees(tmpAssignees)
            }
        } else {
            newChecked.splice(currentIndex, 1);
            const tmpAssignees = assignees;
            tmpAssignees.splice(assignees.indexOf(users[value]), 1)
            setAssignees(tmpAssignees)
        }

        setChecked(newChecked);
    };

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
                    border: '1px solid #ccc'
                }}
              >
                  <FixedSizeList
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={users.length}
                    itemData={{users, readOnly, assignees, setAssignees, checked, setChecked, handleToggle}}
                    style={{ overflow: 'auto'}}
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