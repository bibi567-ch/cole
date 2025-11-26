<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí se configura para permitir que tu frontend acceda a la API sin ser
    | bloqueado por el navegador (Error de CORS).
    |
    */

    // MODIFICACIÓN 1: Rutas a las que se aplica la regla de CORS
    'paths' => ['api/*', 'login', 'register'], 

    'allowed_methods' => ['*'], // Permite todos los métodos (GET, POST, etc.)

    // MODIFICACIÓN 2: Definimos el origen permitido (Tu frontend de Next.js)
    'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'], // Permite todos los encabezados necesarios para JWT y JSON

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];