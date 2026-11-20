import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    TextField,
    InputAdornment,
    Chip,
    AppBar,
    Toolbar,
    Container,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';

// Фейковые данные для наглядности
const mockUsers = [
    { id: 1, name: 'Алексей Панин', email: 'alex@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Иван Иванов', email: 'ivan@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Мария Петрова', email: 'maria@example.com', role: 'user', status: 'blocked' },
    { id: 4, name: 'Сергей Сидоров', email: 'sergey@example.com', role: 'user', status: 'active' },
];

const AdminPage = () => {
    const [search, setSearch] = useState('');

    // Простая фильтрация по имени или email
    const filteredUsers = mockUsers.filter(
        (user) =>
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', pb: 4 }}>
            {/* Шапка сайта */}
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <IconButton
                        component={RouterLink}
                        to="/"
                        edge="start"
                        color="inherit"
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        Админ-панель
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => alert('Здесь будет открываться модалка добавления пользователя')}
                    >
                        Добавить
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Контент */}
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Поиск */}
                <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <TextField
                        size="small"
                        placeholder="Поиск по имени или email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        // 👇 Заменяем InputProps на slotProps.input
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{ width: 300, bgcolor: 'white', borderRadius: 1 }}
                    />
                </Box>

                {/* Таблица */}
                <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ bgcolor: '#fafafa' }}>
                            <TableRow>
                                <TableCell><strong>ID</strong></TableCell>
                                <TableCell><strong>Имя</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Роль</strong></TableCell>
                                <TableCell><strong>Статус</strong></TableCell>
                                <TableCell align="right"><strong>Действия</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow
                                        key={user.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {user.id}
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.role === 'admin' ? 'Админ' : 'Пользователь'}
                                                color={user.role === 'admin' ? 'secondary' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.status === 'active' ? 'Активен' : 'Заблокирован'}
                                                color={user.status === 'active' ? 'success' : 'error'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() => alert(`Редактировать ${user.name}`)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => alert(`Удалить ${user.name}`)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        Пользователи не найдены
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </Box>
    );
};

export default AdminPage;