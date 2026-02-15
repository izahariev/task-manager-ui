import AddIcon from '@mui/icons-material/Add';
import {Box, ToggleButton, ToggleButtonGroup, Typography} from "@mui/material";
import PropTypes from "prop-types";
import RowButton from "../row/RowButton.jsx";

SubtaskHeaderSection.propTypes = {
    activeTab: PropTypes.string,
    subtaskTypePending: PropTypes.bool.isRequired,
    onSubtaskTypeChange: PropTypes.func.isRequired,
    onAddClick: PropTypes.func.isRequired,
};

function SubtaskHeaderSection(props) {
    const {
        activeTab,
        subtaskTypePending,
        onSubtaskTypeChange,
        onAddClick,
    } = props;

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
            position: 'relative'
        }}>
            <Typography variant="h6" component="div">
                Subtasks
            </Typography>
            {activeTab !== "completed" && (
                <Box sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <ToggleButtonGroup
                        value={subtaskTypePending ? 'pending' : 'completed'}
                        exclusive
                        onChange={(event, value) => {
                            if (value !== null) {
                                onSubtaskTypeChange(value);
                            }
                        }}
                        size="small"
                        sx={{
                            '& .MuiToggleButton-root': {
                                color: '#2D3748',
                                borderColor: '#CBD5E0',
                                '&.Mui-selected': {
                                    backgroundColor: '#5B7FA6',
                                    color: '#FFFFFF',
                                    '&:hover': {
                                        backgroundColor: '#4A6B8F',
                                    }
                                },
                                '&:hover': {
                                    backgroundColor: '#E0E7FF',
                                }
                            }
                        }}
                    >
                        <ToggleButton value="pending">
                            Pending subtasks
                        </ToggleButton>
                        <ToggleButton value="completed">
                            Completed subtasks
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            )}
            <RowButton
                backgroundColor="#5B7FA6"
                hoverBackgroundColor="#4A6B8F"
                onClick={onAddClick}
                icon={<AddIcon sx={{color: "white"}} fontSize="small"/>}
            />
        </Box>
    );
}

export default SubtaskHeaderSection;
