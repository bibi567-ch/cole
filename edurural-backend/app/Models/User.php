<?php

namespace App\Models;

// Importar los modelos relacionados
use App\Models\Grade;
use App\Models\Attendance;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Los atributos que son asignables masivamente ($fillable).
     * Esto corrige el error de Asignación Masiva.
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Clave para la gestión de roles
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // RELACIONES (Para el Módulo Académico) 📚
    
    public function gradesAsStudent()
    {
        // Un estudiante puede tener muchas calificaciones
        return $this->hasMany(Grade::class, 'student_id');
    }

    public function gradesAsTeacher()
    {
        // Un docente puede haber registrado muchas calificaciones
        return $this->hasMany(Grade::class, 'teacher_id');
    }

    public function attendancesAsStudent()
    {
        // Un estudiante puede tener muchos registros de asistencia
        return $this->hasMany(Attendance::class, 'student_id');
    }

    public function attendancesAsTeacher()
    {
        // Un docente puede haber registrado muchos registros de asistencia
        return $this->hasMany(Attendance::class, 'teacher_id');
    }
}