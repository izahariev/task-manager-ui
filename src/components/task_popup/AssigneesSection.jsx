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

    // Determine the display text
    let displayText = "Any";
    if (index > 0) {
        if (users && users[index - 1] && users[index - 1].name) {
            displayText = users[index - 1].name;
        } else {
            // If user doesn't exist, don't show anything (but still render to avoid react-window issues)
            displayText = "";
        }
    }

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
              sx={{
                  color: '#5B7FA6',
                  '&.Mui-checked': {
                      color: '#5B7FA6',
                  },
                  '&.Mui-disabled': {
                      color: '#CBD5E0',
                  }
              }}
            />
        }
        disablePadding
        sx={{
            backgroundColor: checked.includes(index) ? "#E0E7FF" : "transparent",
            '&:hover': {
                backgroundColor: checked.includes(index) ? "#C7D2FE" : "#F7FAFC"
            }
        }}
      >
          <ListItemButton>
              <ListItemText id={index} primary={displayText} />
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
              .map(a => users.findIndex(u => u.name === a))
              .filter(i => i !== -1)
              .map(i => i + 1); // Offset by 1 because index 0 is "Any"

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
                const tmpAssignees = [...assignees];
                tmpAssignees.push(users[value - 1].name)
                setAssignees(tmpAssignees)
            }
        } else {
            newChecked.splice(currentIndex, 1);
            const tmpAssignees = [...assignees];
            tmpAssignees.splice(assignees.indexOf(users[value - 1].name), 1)
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
                    border: '1px solid #CBD5E0',
                    borderRadius: '8px',
                    backgroundColor: '#FFFFFF'
                }}
              >
                  <FixedSizeList
                    height={400}
                    width={360}
                    itemSize={46}
                    itemCount={(users && Array.isArray(users) ? users.filter(u => u && u.name).length : 0) + 1}
                    itemData={{users: users && Array.isArray(users) ? users.filter(u => u && u.name) : [], readOnly, assignees, setAssignees, checked, setChecked, handleToggle}}
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