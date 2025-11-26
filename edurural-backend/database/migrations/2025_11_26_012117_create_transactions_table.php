<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();

            // Claves Foráneas
            $table->unsignedBigInteger('request_id');
            $table->foreign('request_id')->references('id')->on('service_requests')->onDelete('cascade');
            
            $table->unsignedBigInteger('provider_id');
            $table->foreign('provider_id')->references('id')->on('users')->onDelete('restrict'); 

            $table->decimal('amount', 8, 2);
            
            // Estado del Flujo de Escrow (RF09)
            $table->enum('status', ['paid', 'released', 'disputed', 'canceled'])->default('paid'); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};