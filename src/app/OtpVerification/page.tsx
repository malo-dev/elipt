'use client'; // Assurez-vous que le code est exécuté uniquement côté client

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

import { useRouter } from 'next/navigation';
function OtpVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Gestion des paramètres de recherche via useSearchParams
  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    } else {
      router.push("/SignUp");
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("https://elipt-test-api.onrender.com/AppUsers/ActiveAccount/verifyCode", {
        email,
        token: otp,
      });
      console.log(response.data);
      setMessage("Code vérifié avec succès ! Redirection...");
      setTimeout(() => {
        router.push(`/config-account?email=${email}&token=${otp}`);
      }, 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Échec de la vérification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Vérification OTP</h2>
        {message && (
          <p className={`text-center text-sm mb-4 ${message.includes("succès") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code OTP</label>
            <input
              type="text"
              placeholder="Entrez votre code OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Vérification..." : "Vérifier le code"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <OtpVerification />
    </Suspense>
  );
}
