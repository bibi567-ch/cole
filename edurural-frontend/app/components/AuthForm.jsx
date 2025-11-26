"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { setLogin } from "../../store";

// Asegúrate de que este archivo se llame AuthForm.jsx
const API_BASE_URL = "http://localhost:8000/api";

export default function AuthForm({ type = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const isRegister = type === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegister ? "register" : "login";
    const body = isRegister ? { name, email, password } : { email, password };
    
    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Credenciales inválidas.");
        return;
      }
      
      if (isRegister) {
        alert("Registro exitoso. Inicia sesión.");
        router.push("/login");
        return;
      }

      // LOGIN EXITOSO
      Cookies.set("session", data.token, { expires: 7, path: "/" });
      dispatch(setLogin({ user: data.user, token: data.token }));
      
      // Redirección por Rol
      switch (data.user.role) {
          case 'admin':
              router.push("/dashboard/admin");
              break;
          case 'artist':
              router.push("/dashboard/artist");
              break;
          default: // 'user'
              router.push("/");
              break;
      }

    } catch (err) {
      console.error("Error de red:", err);
      setError("No se pudo conectar con el servidor. Verifica el Backend.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>{isRegister ? "Registro" : "Inicio de Sesión"}</h2>
      <form onSubmit={handleSubmit}>
        
        {isRegister && (
          <div style={{ marginBottom: '15px' }}>
            <label>Nombre</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }} />
        </div>
        
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isRegister ? "Registrarse" : "Ingresar"}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        {isRegister ? (
          <span>¿Ya tienes cuenta? <a href="/login">Inicia Sesión</a></span>
        ) : (
          <span>¿No tienes cuenta? <a href="/register">Regístrate</a></span>
        )}
      </p>
    </div>
  );
}