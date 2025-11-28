import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { apiFetch } from "../../api";
import { Loading } from "../../components/Loading";

export const Register = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const { formValues, handleInputChange } = useForm({
    username: "",
    email: "",
    password: "",
    firstname: "",
    lastname: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formValues.username ||
      !formValues.email ||
      !formValues.password ||
      !formValues.firstname ||
      !formValues.lastname
    ) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await apiFetch("/api/register", {
        method: "POST",
        body: {
          name: formValues.firstname,
          lastname: formValues.lastname,
          username: formValues.username,
          email: formValues.email,
          password: formValues.password,
        },
      });

      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      setErrorMsg(error.message || "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Registro</h2>

      {loading && <Loading />}

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="firstname">
            Nombre
          </label>
          <input
            id="firstname"
            name="firstname"
            value={formValues.firstname}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="lastname">
            Apellido
          </label>
          <input
            id="lastname"
            name="lastname"
            value={formValues.lastname}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Usuario
          </label>
          <input
            id="username"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleInputChange}
            className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold py-2 rounded-md"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </section>
  );
};

 export default Register