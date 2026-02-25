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
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export function useFetchSub(endpoint: string) {
  return useQuery({
    queryKey: ["fetchSub", endpoint],
    queryFn: () => fetchSub(endpoint),
    enabled: !!endpoint, // Only run the query if endpoint is not empty
  });
}
