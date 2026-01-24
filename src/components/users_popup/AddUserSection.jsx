import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {Box, Button, Paper, TextField, Typography} from "@mui/material";
import PropTypes from "prop-types";
import {useUsers} from "../../contexts/UsersContext.jsx";

export default function AddUserSection({
    newUser,
    setNewUser,
    editedUser,
    setEditedUser,
    setErrorMessages,
    handleAddUser,
}) {
    const {refreshUsers} = useUsers();

    return (
      <Paper
        elevation={0}
        sx={{
            backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            padding: "16px"
        }}
      >
          <Typography variant="subtitle2" sx={{marginBottom: "12px", fontWeight: 600, color: "#2D3748"}}>
              Add New User
          </Typography>
          <Box sx={{display: "flex", gap: "8px", alignItems: "center"}}>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                size="small"
                onChange={(e) => setNewUser(e.target.value)}
                onClick={() => {
                    if (editedUser !== "") {
                        setErrorMessages([]);
                    }
                    setEditedUser("");
                }}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  handleAddUser({newUser, setNewUser, setErrorMessages, refreshUsers})
                }
                value={newUser}
                sx={{
                    "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                            borderColor: "#5B7FA6"
                        }
                    }
                }}
              />
              <Button
                variant="contained"
                startIcon={<PersonAddIcon />}
                sx={{
                    backgroundColor: "#5B7FA6",
                    "&:hover": {
                        backgroundColor: "#4A6B8F"
                    },
                    transition: "background-color 0.2s ease",
                    minWidth: "120px",
                    whiteSpace: "nowrap"
                }}
                onClick={() =>
                  handleAddUser({newUser, setNewUser, setErrorMessages, refreshUsers})
                }
              >
                  Add User
              </Button>
          </Box>
      </Paper>
    );
}

AddUserSection.propTypes = {
    newUser: PropTypes.string.isRequired,
    setNewUser: PropTypes.func.isRequired,
    editedUser: PropTypes.string.isRequired,
    setEditedUser: PropTypes.func.isRequired,
    setErrorMessages: PropTypes.func.isRequired,
    handleAddUser: PropTypes.func.isRequired
};
