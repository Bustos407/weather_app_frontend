import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false); // Nuevo estado de carga
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true); // Activar estado de carga
  
    try {
      const endpoint = isRegister ? "/auth/register" : "/auth/login";
      const { data } = await api.post(endpoint, { username, password });
  
      if (!isRegister) {
        if (data.token && data.userId) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          navigate("/home");
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      } else {
        setIsRegister(false);
        setUsername('');
        setPassword('');
        setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error 
        || error.message 
        || "Error de conexión";
        
      setError(errorMessage);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    } finally {
      setLoading(false); // Desactivar estado de carga siempre
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Registrarse" : "Iniciar sesión"}
        </h2>

        {loading && (
          <p className="bg-blue-100 text-blue-700 p-2 rounded mb-4 text-center">
            Esperando mientras se hacen las solicitudes...
          </p>
        )}

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Procesando..." : (isRegister ? "Registrarse" : "Iniciar sesión")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isRegister ? "¿Ya tienes una cuenta?" : "¿No tienes una cuenta?"}{" "}
          <button
            className="text-blue-500 hover:underline disabled:opacity-50"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
              setSuccess(null);
            }}
            disabled={loading}
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;