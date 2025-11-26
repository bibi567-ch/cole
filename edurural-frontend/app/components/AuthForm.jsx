"use client";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { setLogin } from "../../store";

const API_BASE_URL = "http://localhost:8000/api";

export default function AuthForm({ type = "login" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const isRegister = type === "register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        setLoading(false);
        return;
      }
      
      if (isRegister) {
        alert("✅ Registro exitoso. Ahora inicia sesión.");
        router.push("/login");
        return;
      }

      // LOGIN EXITOSO - Guardar sesión
      Cookies.set("session", data.token, { expires: 7, path: "/" });
      dispatch(setLogin({ user: data.user, token: data.token }));
      
      // ✅ Redirección por Rol CORREGIDA
      switch (data.user.role) {
          case 'admin':
              router.push("/dashboard/admin");
              break;
          case 'teacher':
              router.push("/dashboard/teacher");
              break;
          case 'parent':
              router.push("/dashboard/parent");
              break;
          case 'provider':
              router.push("/dashboard/provider");
              break;
          default: // 'student'
              router.push("/dashboard/student");
              break;
      }

    } catch (err) {
      console.error("Error de red:", err);
      setError("❌ No se pudo conectar con el servidor. Verifica que el Backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>
        {isRegister ? "📝 Crear Cuenta" : "🔐 Iniciar Sesión"}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Nombre Completo</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }} 
            />
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Correo Electrónico</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }} 
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contraseña</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }} 
          />
        </div>
        
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '5px', marginBottom: '15px' }}>
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: loading ? '#ccc' : '#0070f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s'
          }}
        >
          {loading ? '⏳ Procesando...' : (isRegister ? "Registrarse" : "Ingresar")}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        {isRegister ? (
          <span>¿Ya tienes cuenta? <a href="/login" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '500' }}>Inicia Sesión</a></span>
        ) : (
          <span>¿No tienes cuenta? <a href="/register" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: '500' }}>Regístrate</a></span>
        )}
      </p>
    </div>
  );
}