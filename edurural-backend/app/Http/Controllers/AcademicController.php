<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Grade;
use App\Models\Attendance;
use Exception;

class AcademicController extends Controller
{
    /**
     * Obtiene las calificaciones del usuario autenticado (Estudiante). (RF02)
     */
    public function viewMyGrades(Request $request)
{
    try {
        // [1] El usuario se obtiene del token JWT procesado por el middleware
        $user = $request->user(); 

        // [2] Usar la relación gradesAsStudent para filtrar por el usuario actual
        $grades = $user->gradesAsStudent()->select('subject', 'score')->get();

        return response()->json(['grades' => $grades]);

    } catch (\Exception $e) {
        // Si hay un error de DB, devolver JSON de error (robusto)
        return response()->json(['error' => 'No se pudieron cargar las calificaciones.'], 500);
    }
}
    /**
     * Obtiene los registros de asistencia del usuario autenticado (Estudiante). (RF03)
     */
    public function viewMyAttendance(Request $request)
    {
        try {
            $user = $request->user();

            // Retorna la asistencia del usuario logeado
            $attendance = $user->attendancesAsStudent()->select('date', 'status')->orderBy('date', 'desc')->get();

            return response()->json(['attendance' => $attendance]);

        } catch (Exception $e) {
            \Log::error("Error cargando asistencia: " . $e->getMessage());
            return response()->json(['error' => 'No se pudo cargar la asistencia.'], 500);
        }
    }
    // ... (dentro de la clase AcademicController)

    /**
     * Obtiene la lista simple de todos los estudiantes.
     */
    public function listStudents()
    {
        try {
            // Solo retornamos ID y nombre para la selección en el frontend
            $students = User::where('role', 'student')->select('id', 'name')->get();

            return response()->json(['students' => $students]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar estudiantes.'], 500);
        }
    }

// ... (El resto de métodos: viewMyGrades, viewMyAttendance, createGrade, createAttendance)
    
    // Aquí irían createGrade, createAttendance, etc.
}