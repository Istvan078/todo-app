import { setHeaders } from "@/headers/auth.header";
import type { IResponse } from "@/types/response.interface";
import type { ITask } from "@/types/task.interface";
import { useQuery } from "@tanstack/react-query";

const fetchTasks = async (): Promise<IResponse<ITask[]> | undefined> => {
  const headers = setHeaders();
  try {
    console.log("***Fetching tasks**...");
    const response = await fetch(`${import.meta.env.VITE_API_URL}tasks`, {
      method: "GET",
      headers: headers,
    });
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

export function useFetchTasks(params: {}) {
  return useQuery({
    queryKey: ["fetchTasks", params],
    queryFn: fetchTasks,
  });
}
