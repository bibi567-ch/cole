import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Hook para realizar peticiones autenticadas a la API de Laravel usando JWT de las Cookies.
 */
export default function useAuthApi() {

    const makeRequest = async (endpoint, method = 'GET', data = null) => {
        // 1. Leer el token JWT de la cookie 'session'
        const token = Cookies.get('session');

        if (!token) {
            console.error("No se encontró el token JWT.");
            return { error: "AUTH_REQUIRED" }; 
        }

        const url = `${API_BASE_URL}${endpoint}`;
        
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        };

        const config = {
            method,
            headers,
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, config);
            const responseData = await response.json();

            if (response.status === 401 || response.status === 403) {
                // Si el token es inválido/expirado
                return { error: "AUTH_EXPIRED" };
            }

            if (!response.ok) {
                return { error: responseData.error || `Error ${response.status} en la API` };
            }

            // Devolver los datos de éxito
            return responseData;

        } catch (error) {
            console.error("Error de red o servidor:", error);
            return { error: "NETWORK_FAILURE" };
        }
    };

    return { makeRequest };
}