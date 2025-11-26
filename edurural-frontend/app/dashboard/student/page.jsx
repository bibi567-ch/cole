"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { setLogout } from '../../../store'; // Asume que tienes setLogout

import { 
    Container, Typography, Card, CardContent, Button, Box, Divider, Grid 
} from "@mui/material";
import { School, CheckBox, ExitToApp, Schedule, Warning } from "@mui/icons-material";
import useAuthApi from '../../../utils/useAuthApi'; 

export default function StudentDashboard() {
    const user = useSelector((state) => state.auth.user);
    const { makeRequest } = useAuthApi();
    const dispatch = useDispatch();
    const router = useRouter(); 

    const [grades, setGrades] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(null);

    // LÓGICA DE CIERRE DE SESIÓN
    const handleLogout = () => {
        dispatch(setLogout()); 
        Cookies.remove('session'); 
        router.push('/login'); 
    };

    // FUNCIÓN PARA CARGAR DATOS
    useEffect(() => {
        const fetchAcademicData = async () => {
            if (!user || !user.id) {
                setLoading(false);
                return;
            }

            // 1. Petición de Calificaciones (RF02)
            const gradesResult = await makeRequest(`/academic/my-grades`);
            if (gradesResult.error) { 
                setApiError(gradesResult.error);
                setLoading(false);
                return; 
            }
            setGrades(gradesResult.grades || []);

            // 2. Petición de Asistencia (RF03)
            const attendanceResult = await makeRequest(`/academic/my-attendance`);
            if (attendanceResult.error) { 
                setApiError(attendanceResult.error);
                setLoading(false);
                return; 
            }
            setAttendance(attendanceResult.attendance || []);
            
            setLoading(false);
        };
        fetchAcademicData();
    }, [user, makeRequest]);


    // Manejo de estado de carga y errores fatales de conexión/autenticación
    if (loading) {
        return <Container maxWidth="md" sx={{ mt: 5 }}><Typography>Cargando datos académicos...</Typography></Container>;
    }
    
    if (apiError) {
        if (apiError === "AUTH_EXPIRED" || apiError === "AUTH_REQUIRED") {
            handleLogout();
            return null;
        }
        return (
            <Container maxWidth="md" sx={{ mt: 5 }}>
                <Typography variant="h5" color="error" sx={{ mb: 2 }}>
                    <Warning sx={{ mr: 1 }} /> Error de Conexión: {apiError}
                </Typography>
                <Typography>No se pudieron cargar los datos. El token puede haber expirado. Intenta iniciar sesión de nuevo.</Typography>
                <Button onClick={handleLogout} sx={{ mt: 2 }}>Volver a Iniciar Sesión</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4, 
                p: 3, 
                bgcolor: '#f5f5f5', 
                borderRadius: '8px' 
            }}>
                <Box>
                    <Typography variant="h4" component="h1" fontWeight={700} color="primary">
                        Dashboard Escolar
                    </Typography>
                    <Typography variant="h6" component="h2" color="text.secondary">
                        Bienvenido, {user ? user.name : 'Estudiante'}
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    color="error" 
                    onClick={handleLogout}
                    startIcon={<ExitToApp />}
                >
                    Cerrar Sesión
                </Button>
            </Box>

            <Grid container spacing={4}>
                {/* MIS CALIFICACIONES (RF02) */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ minHeight: 250, borderLeft: '5px solid #1976d2' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <School color="primary" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight={600}>
                                    Mis Calificaciones
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {grades.length === 0 ? (
                                <Typography color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                                    No tienes calificaciones registradas aún.
                                </Typography>
                            ) : (
                                <ul>
                                    {grades.map((grade, index) => (
                                        <li key={index}>
                                            <Typography variant="body1">
                                                **{grade.subject}**: {grade.score}%
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* REGISTRO DE ASISTENCIA (RF03) */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ minHeight: 250, borderLeft: '5px solid #388e3c' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CheckBox color="success" sx={{ mr: 1 }} />
                                <Typography variant="h6" fontWeight={600}>
                                    Registro de Asistencia
                                </Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />
                            {attendance.length === 0 ? (
                                <Typography color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
                                    No hay registros de asistencia.
                                </Typography>
                            ) : (
                                <ul>
                                    {attendance.map((att, index) => (
                                        <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                            <Schedule fontSize="small" sx={{ mr: 1, color: att.status === 'present' ? 'green' : 'red' }} />
                                            <Typography variant="body2">
                                                {att.date}: <span style={{ fontWeight: 600 }}>{att.status.toUpperCase()}</span>
                                            </Typography>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}