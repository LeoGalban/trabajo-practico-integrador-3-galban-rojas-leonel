import { useEffect, useState } from "react";
import { apiFetch } from "../api";
import { Loading } from "../components/Loading";

export const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiFetch("/api/profile");
        setUser(data.user);
      } catch (error) {
        console.error("Error al cargar perfil:", error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) return <Loading />;

  if (!user) {
    return (
      <p className="text-center text-sm text-red-600">
        No se pudo cargar el perfil.
      </p>
    );
  }

  return (
    <section className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Mi Perfil</h2>

      <p>
        <span className="font-semibold">ID:</span> {user.id}
      </p>
      <p>
        <span className="font-semibold">Nombre:</span> {user.name} {user.lastname}
      </p>
    </section>
  );
};

 export default Profile