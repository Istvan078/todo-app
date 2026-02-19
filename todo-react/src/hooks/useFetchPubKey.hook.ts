import { setHeaders } from "@/headers/auth.header";
import { useQuery } from "@tanstack/react-query";

const fetchPubKey = async () => {
  const headers = setHeaders();
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}push/public-key`,
    {
      method: "GET",
      headers: headers,
    },
  );
  if (!response.ok) {
    throw new Error("Network response not OK");
  }
  return response.json();
};

export function useFetchPubKey() {
  return useQuery({
    queryKey: ["fetchPubKey"],
    queryFn: fetchPubKey,
  });
}
