import { setHeaders } from "@/headers/auth.header";
import { useQuery } from "@tanstack/react-query";

const fetchSub = async (endpoint: string) => {
  const headers = setHeaders();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}push/mysub`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ endpoint }),
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export function useFetchSub(endpoint: string) {
  return useQuery({
    queryKey: ["fetchSub", endpoint],
    queryFn: () => fetchSub(endpoint),
  });
}
