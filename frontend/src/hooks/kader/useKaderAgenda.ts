import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useKaderAgenda = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: rawResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["kader-agenda", page],
    queryFn: async () => {
      const response = await api.get("/dashboard/kader/priority-agenda", {
        params: { page, limit },
      });
      return response.data;
    },
  });

  // Perhatikan path-nya: rawResponse (Axios) -> data (Global) -> data (Internal)
  const agendaList = rawResponse?.data?.data || [];
  const metaData = rawResponse?.data?.meta || {
    total: 0,
    page: 1,
    totalPages: 1,
  };

  return {
    agenda: agendaList,
    meta: metaData,
    isLoading,
    isError,
    page,
    setPage,
    refetch,
  };
};
