"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Next.js App Router
import axios from "axios";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://elipt-test-api.onrender.com/AppUsers/SignUp", {
        fname: formData.firstname,
        lname: formData.lastname,
        email: formData.email,
      });

      // Redirige vers la page de vérification OTP avec l'email en paramètre
      router.push(`/OtpVerification?email=${formData.email}`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Échec de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Créer un compte</h2>
        {message && <p className="text-center text-sm text-red-500 mb-4">{message}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="lastname"
              placeholder="Votre nom"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="firstname"
              placeholder="Votre prénom"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
}
