<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    protected $fillable = [
        'solicitant_id', 'title', 'description', 
        'category', 'budget', 'location', 'status'
    ];

    public function solicitant()
    {
        return $this->belongsTo(User::class, 'solicitant_id');
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'request_id');
    }
}