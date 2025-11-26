<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;
use App\Models\User;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Token no proporcionado.'], 401);
        }

        try {
            $key = env('JWT_SECRET'); 
            $credentials = JWT::decode($token, new Key($key, 'HS256'));
        } catch (Exception $e) {
            return response()->json(['error' => 'Token inválido o expirado.'], 401);
        }

        $user = User::find($credentials->sub);

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado.'], 401);
        }

        $request->auth = $user;
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}