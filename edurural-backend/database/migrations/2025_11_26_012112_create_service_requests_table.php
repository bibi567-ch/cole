<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();

            // Clave Foránea al Solicitante
            $table->unsignedBigInteger('solicitant_id');
            $table->foreign('solicitant_id')->references('id')->on('users')->onDelete('cascade');

            $table->string('title');
            $table->text('description');
            $table->string('category');
            
            $table->decimal('budget', 8, 2);
            $table->string('location')->nullable(); 
            
            // Estado de la Solicitud (RF07)
            $table->enum('status', ['open', 'quoted', 'accepted', 'completed', 'disputed'])->default('open');
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_requests');
    }
};