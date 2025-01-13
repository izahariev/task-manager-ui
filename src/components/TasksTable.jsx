import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Row from "./Row.jsx";


function createData(priority, title, deadline, assignees) {
    return {
        priority,
        title,
        deadline,
        assignees,
        subtasks: [
            {
                priority: '2020-01-05',
                title: '11091700',
                deadline: '2020-01-05',
                assignees: 'Ivo'
            },
            {
                priority: '2020-01-05',
                title: '11091700',
                deadline: '2020-01-05',
                assignees: 'Ivo'
            },
        ],
    };
}

const rows = [
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
    createData('P0', 'Pay taxes', '2025-03-31', 'Ivo'),
    createData('P1', 'Throw out trash', '', 'Ivo'),
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
    createData('P0', 'Pay taxes', '2025-03-31', 'Ivo'),
    createData('P1', 'Throw out trash', '', 'Ivo'),
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
    createData('P0', 'Pay taxes', '2025-03-31', 'Ivo'),
    createData('P1', 'Throw out trash', '', 'Ivo'),
    createData('P0', 'Car service', '2024-07-15', 'Ivo Ivo2'),
];

function TasksTable() {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow sx={{backgroundColor: '#0EB1D2'}}>
                        <TableCell />
                        <TableCell>Priority</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Deadline</TableCell>
                        <TableCell>Assignees</TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, index) => (
                        <Row key={row.title} row={row} index={index} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default TasksTable;