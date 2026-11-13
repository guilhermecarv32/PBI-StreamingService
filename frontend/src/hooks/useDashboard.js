import { useEffect, useState } from 'react';

export function useDashboard(filters) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      plano: filters.plano,
      churn: filters.churn,
    });

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/dashboard?${params}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error('Não foi possível carregar o painel.');
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Erro inesperado.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [filters.plano, filters.churn]);

  return { data, loading, error };
}
