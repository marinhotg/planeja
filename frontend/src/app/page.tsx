"use client";

import { useState } from "react";

export default function Home() {
  const [apiResponse, setApiResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/test");
      const data = await response.text();
      setApiResponse(data);
    } catch (error) {
      setApiResponse("Erro ao conectar com a API: " + error);
    } finally {
      setLoading(false);
    }
  };

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/health");
      const data = await response.text();
      setApiResponse(data);
    } catch (error) {
      setApiResponse("Erro ao conectar com a API: " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">Hello World</h1>

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={testAPI}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testando..." : "Testar API"}
          </button>

          <button
            onClick={testHealth}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Testando..." : "Testar Health"}
          </button>
        </div>

        {apiResponse && (
          <div className="p-4 bg-gray-100 rounded">
            <strong>Resposta da API:</strong>
            <p className="mt-2">{apiResponse}</p>
          </div>
        )}
      </div>
    </main>
  );
}
