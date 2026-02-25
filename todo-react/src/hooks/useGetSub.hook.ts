import { setHeaders } from "@/headers/auth.header";
import { useQuery } from "@tanstack/react-query";

const fetchSub = async () => {
  const headers = setHeaders();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}push/mysub`, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

export function useFetchSub() {
  return useQuery({
    queryKey: ["fetchSub"],
    queryFn: fetchSub,
  });
}
