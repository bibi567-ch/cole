"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { setLogout } from '../../../store';

import { 
    Container, Typography, Card, CardContent, Button, Box, Divider, Grid,
    TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress 
} from "@mui/material";
import { Grade, CheckBox, ExitToApp, Group } from "@mui/icons-material";
import useAuthApi from '../../../utils/useAuthApi'; 

export default function TeacherDashboard() {
    const user = useSelector((state) => state.auth.user);
    const { makeRequest } = useAuthApi();
    const dispatch = useDispatch();
    const router = useRouter();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // Estados para los formularios de registro
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [gradeScore, setGradeScore] = useState('');
    const [gradeSubject, setGradeSubject] = useState('');
    const [attendanceStatus, setAttendanceStatus] = useState('present');
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);

    // LÓGICA DE CIERRE DE SESIÓN
    const handleLogout = () => {
        dispatch(setLogout()); 
        Cookies.remove('session'); 
        router.push('/login'); 
    };

    // FUNCIÓN PARA CARGAR LA LISTA DE ESTUDIANTES
    useEffect(() => {
        const fetchStudents = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            // Asegurarse de que el usuario sea docente antes de cargar
            if (user.role !== 'teacher') {
                setApiError("Acceso denegado. No es un Docente.");
                setLoading(false);
                return;
            }

            const result = await makeRequest('/academic/students');
            
            if (result.error) {
                setApiError(result.error);
            } else {
                setStudents(result.students || []);
                if (result.students.length > 0) {
                    setSelectedStudentId(result.students[0].id);
                }
            }
            setLoading(false);
        };
        fetchStudents();
    }, [user, makeRequest]);

    // =========================================================
    // LÓGICA DE GESTIÓN DE CALIFICACIONES
    // =========================================================
    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        if (!selectedStudentId || !gradeScore || !gradeSubject) return;

        const data = {
            student_id: selectedStudentId,
            subject: gradeSubject,
            score: parseFloat(gradeScore),
        };

        const result = await makeRequest('/academic/grade', 'POST', data);
        
        if (result.error) {
            setApiError(result.error);
        } else {
            alert(`Calificación para ${result.grade.subject} registrada con éxito!`);
            setGradeScore('');
            setGradeSubject('');
        }
    };
    
    // =========================================================
    // LÓGICA DE GESTIÓN DE ASISTENCIA
    // =========================================================
    const handleAttendanceSubmit = async (e) => {
        e.preventDefault();
        setApiError(null);
        if (!selectedStudentId || !attendanceDate || !attendanceStatus) return;

        const data = {
            student_id: selectedStudentId,
            date: attendanceDate,
            status: attendanceStatus,
        };

        const result = await makeRequest('/academic/attendance', 'POST', data);
        
        if (result.error) {
            setApiError(result.error);
        } else {
            alert(`Asistencia registrada para ${result.attendance.date}.`);
        }
    };


    if (loading) {
        return <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}><CircularProgress /><Typography sx={{ mt: 2 }}>Cargando estudiantes...</Typography></Container>;
    }
    
    if (apiError || !user || user.role !== 'teacher') {
        // Manejo de errores o acceso denegado
        return (
            <Container maxWidth="md" sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Acceso Denegado o Error de Conexión.</Typography>
                <Typography sx={{ mt: 1 }}>{apiError || "Solo los Docentes pueden acceder a esta gestión."}</Typography>
                <Button onClick={handleLogout} sx={{ mt: 3 }} startIcon={<ExitToApp />}>
                    Volver al Login
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, p: 3, bgcolor: '#e3f2fd', borderRadius: '8px' }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="primary">
                        Panel del Docente
                    </Typography>
                    <Typography variant="h6" component="h2" color="text.secondary">
                        Gestión Académica de {students.length} Estudiantes | Docente: {user.name}
                    </Typography>
                </Box>
                <Button variant="contained" color="error" onClick={handleLogout} startIcon={<ExitToApp />}>
                    Cerrar Sesión
                </Button>
            </Box>
            
            {/* Selector de Estudiante */}
            <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel id="student-select-label">Seleccionar Estudiante</InputLabel>
                <Select
                    labelId="student-select-label"
                    value={selectedStudentId}
                    label="Seleccionar Estudiante"
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    disabled={students.length === 0}
                >
                    {students.length === 0 && (
                         <MenuItem disabled>No hay estudiantes registrados</MenuItem>
                    )}
                    {students.map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                            {student.name} (ID: {student.id})
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Grid container spacing={4}>
                {/* -------------------- 1. REGISTRAR CALIFICACIONES (RF02) -------------------- */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderLeft: '5px solid #ff9800' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Grade color="warning" sx={{ mr: 1 }} />
                                <Typography variant="h5" fontWeight={600}>
                                    Registrar Calificación
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            <form onSubmit={handleGradeSubmit}>
                                <TextField
                                    label="Asignatura"
                                    fullWidth
                                    margin="normal"
                                    value={gradeSubject}
                                    onChange={(e) => setGradeSubject(e.target.value)}
                                    required
                                />
                                <TextField
                                    label="Puntuación (0-100)"
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    inputProps={{ step: "0.01", min: "0", max: "100" }}
                                    value={gradeScore}
                                    onChange={(e) => setGradeScore(e.target.value)}
                                    required
                                />
                                <Button type="submit" variant="contained" color="warning" sx={{ mt: 2 }}>
                                    Guardar Calificación
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                {/* -------------------- 2. REGISTRAR ASISTENCIA (RF03) -------------------- */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderLeft: '5px solid #4caf50' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckBox color="success" sx={{ mr: 1 }} />
                                <Typography variant="h5" fontWeight={600}>
                                    Registrar Asistencia
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 3 }} />
                            <form onSubmit={handleAttendanceSubmit}>
                                <TextField
                                    label="Fecha"
                                    type="date"
                                    fullWidth
                                    margin="normal"
                                    value={attendanceDate}
                                    onChange={(e) => setAttendanceDate(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                    required
                                />
                                <FormControl fullWidth margin="normal" required>
                                    <InputLabel id="attendance-status-label">Estado</InputLabel>
                                    <Select
                                        labelId="attendance-status-label"
                                        value={attendanceStatus}
                                        label="Estado"
                                        onChange={(e) => setAttendanceStatus(e.target.value)}
                                    >
                                        <MenuItem value="present">Presente</MenuItem>
                                        <MenuItem value="absent">Ausente</MenuItem>
                                        <MenuItem value="late">Tarde</MenuItem>
                                    </Select>
                                </FormControl>
                                <Button type="submit" variant="contained" color="success" sx={{ mt: 2 }}>
                                    Guardar Asistencia
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}