"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ConfigAccount() {
  const [password, setPassword] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("https://res.cloudinary.com/dvnprk8f8/image/upload/v17/42997318/elipt_images_test/unnjusw4hfdeef91ay96.png");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    router.push("/signup"); // Rediriger vers signup si email ou token manquants
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
  

    try {
      // Configurer le compte avec l'avatar (lien) et le mot de passe
      const configResponse = await axios.put("https://elipt-test-api.onrender.com/AppUsers/ActiveAccount/ConfigAccount", {
        email,
        token,
        avatar: avatarUrl, // Lien de l'avatar
        password,
      });

      setMessage("Compte configuré avec succès !");
      setTimeout(() => {
        // Redirection vers la page de login après la configuration réussie
        router.push("/login");
      }, 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Activation du Compte</h2>
        {message && (
          <p className={`text-center text-sm mb-4 ${message.includes("succès") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lien de l'avatar</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Configuration..." : "Configurer le compte"}
          </button>
        </form>
      </div>
    </div>
  );
}
