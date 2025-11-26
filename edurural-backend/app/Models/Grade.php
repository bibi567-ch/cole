<?php
// =============================================
// app/Models/Grade.php
// =============================================
// =============================================
// app/Models/Grade.php
// =============================================
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'student_id',
        'teacher_id',
        'subject',
        'score'
    ];

    protected $casts = [
        'score' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}