<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Exception;

class AuthController extends Controller
{
    private function generateJwt(User $user)
    // ... (Mantener la función generateJwt como está)
    {
        $key = env('JWT_SECRET');
        $payload = [
            'iss' => "edurural-jwt",
            'sub' => $user->id,
            'role' => $user->role,
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24)
        ];
        return JWT::encode($payload, $key, 'HS256');
    }

    public function register(Request $request)
    {
        try {
            // 1. Validar la entrada de datos
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
            ]);

            // 2. Crear el usuario
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'student', 
            ]);

            // 3. Respuesta de éxito
            return response()->json([
                'message' => 'Usuario registrado exitosamente',
                'user' => $user->only('id', 'name', 'email', 'role'),
            ], 201);
        
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Captura errores de validación y devuelve 422
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            // Captura cualquier otro error (ej. DB) y devuelve un 500 JSON
            return response()->json(['error' => 'Error interno del servidor.'], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            // 1. Validar la entrada de datos
            $request->validate(['email' => 'required|email', 'password' => 'required']);

            $user = User::where('email', $request->email)->first();

            // 2. Verificar credenciales
            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json(['error' => 'Credenciales inválidas.'], 401);
            }

            // 3. Generar token
            $token = $this->generateJwt($user);

            // 4. Respuesta de éxito
            return response()->json([
                'token' => $token,
                'user' => $user->only('id', 'name', 'email', 'role'),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            return response()->json(['error' => 'Error interno del servidor.'], 500);
        }
    }
    
    public function profile(Request $request)
    // ... (Mantener la función profile como está)
    {
        return response()->json($request->user());
    }
}