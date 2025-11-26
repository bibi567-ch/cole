<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Exception;

class AuthController extends Controller
{
    // Función privada para generar el Token JWT
    private function generateJwt(User $user)
    {
        $key = env('JWT_SECRET'); 
        $payload = [
            'iss' => "edurural-jwt", 
            'sub' => $user->id,      
            'role' => $user->role,   // Incluir el rol para el frontend
            'iat' => time(),         
            'exp' => time() + (60 * 60 * 24) // Expiración: 24 horas
        ];
        return JWT::encode($payload, $key, 'HS256');
    }

    /**
     * Registro de nuevo usuario (RF01, RNF01).
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'student', // Rol por defecto
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user->only('id', 'name', 'email', 'role'),
        ], 201);
    }

    /**
     * Inicio de sesión y generación de token.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'error' => 'Credenciales inválidas.'
            ], 401);
        }

        $token = $this->generateJwt($user);

        return response()->json([
            'token' => $token,
            'user' => $user->only('id', 'name', 'email', 'role'),
        ]);
    }

    /**
     * Retorna el perfil del usuario autenticado.
     */
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }
}