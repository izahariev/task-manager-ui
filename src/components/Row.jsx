import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {Box, Collapse, IconButton, styled} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React from "react";


Row.propTypes = {
    row: PropTypes.shape({
        priority: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        deadline: PropTypes.string.isRequired,
        assignees: PropTypes.string.isRequired,
        subtasks: PropTypes.arrayOf(
            PropTypes.shape({
                priority: PropTypes.string.isRequired,
                title: PropTypes.string.isRequired,
                deadline: PropTypes.string.isRequired,
                assignees: PropTypes.string.isRequired,
            }),
        ).isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
};

function Row(props) {
    const { row, index } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' }, backgroundColor: index % 2 === 0 ? '#BFBFBF' : '#A6A6A6'}}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.priority}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>{row.deadline}</TableCell>
                <TableCell>{row.assignees}</TableCell>
                <TableCell align={'right'}>
                    <CheckIcon/><EditIcon/><DeleteIcon/>
                </TableCell>
            </TableRow>
            <TableRow sx={{backgroundColor: index % 2 === 0 ? '#BFBFBF' : '#A6A6A6'}}>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Subtasks
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Priority</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Deadline</TableCell>
                                        <TableCell>Assignees</TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.subtasks.map((subtaskRow) => (
                                        <StyledTableRow key={subtaskRow.title}>
                                            <TableCell>{subtaskRow.priority}</TableCell>
                                            <TableCell>{subtaskRow.title}</TableCell>
                                            <TableCell>{subtaskRow.deadline}</TableCell>
                                            <TableCell>{subtaskRow.assignees}</TableCell>
                                            <TableCell align={'right'}>
                                                <CheckIcon/><EditIcon/><DeleteIcon/>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
        backgroundColor: "#8C5E58",
    },
    '&:nth-of-type(even)': {
        backgroundColor: "#A67F76",
    },
}));

export default Row;