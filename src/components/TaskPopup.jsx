import CloseIcon from "@mui/icons-material/Close";
import {AppBar, Dialog, IconButton, Slide, TextField, Toolbar} from "@mui/material";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";
import AssigneesSection from "./task_popup/AssigneesSection.jsx";
import PrioritySection from "./task_popup/PrioritySection.jsx";
import TimeSection from "./task_popup/TimeSection.jsx";

TaskPopup.propTypes = {
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    readOnlyProp: PropTypes.bool
}

const Transition = React.forwardRef(
  function Transition(props, ref) {
      return <Slide direction="up" ref={ref} {...props} />;
  });

export default function TaskPopup(props) {
    const {open, setOpen, readOnlyProp} = props;
    const [priority, setPriority] = React.useState("P3");
    const [readOnly, setReadOnly] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
      <React.Fragment>
          <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            TransitionComponent={Transition}
          >
              <AppBar sx={{position: 'relative'}}>
                  <Toolbar>
                      <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                      >
                          <CloseIcon/>
                      </IconButton>
                      <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                          Add Task
                      </Typography>
                      {!readOnly && (<Button autoFocus color="inherit" onClick={handleClose}>
                          save
                      </Button>)}
                      {readOnly && (<Button autoFocus color="inherit" onClick={handleClose}>
                          edit
                      </Button>)}
                  </Toolbar>
              </AppBar>
              <List>
                  <Grid container sx={{marginBottom: "2%"}}>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <h2>Title</h2>
                      </Grid>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <TextField
                            {...(readOnly ? { disabled: true } : {})}
                            sx={{width: "96%", margin: "0 2%"}}
                            size={"small"}
                          />
                      </Grid>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <h2>Description</h2>
                      </Grid>
                      <Grid size={12} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <TextField
                            {...(readOnly ? { disabled: true } : {})}
                            multiline={true}
                            rows={3}
                            sx={{width: "96%", margin: "0, 2%"}} size={"small"}/>
                      </Grid>
                      <Grid size={3} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <PrioritySection priority={priority} setPriority={setPriority} readOnly={readOnly} />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection title={"Start time"} readOnly={readOnly} />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection title={"Deadline"} readOnly={readOnly} />
                      </Grid>
                      <Grid size={2} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "4%"
                      }}>
                          <TimeSection title={"Repeat"} readOnly={readOnly} />
                      </Grid>
                      <Grid size={3} sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginBottom: "1%"
                      }}>
                          <AssigneesSection readOnly={readOnly} />
                      </Grid>
                  </Grid>
              </List>
          </Dialog>
      </React.Fragment>
    );
}