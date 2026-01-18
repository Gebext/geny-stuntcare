import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useDebounce } from "../useDebounce";

export const useAdminChildren = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [riskStatus, setRiskStatus] = useState("");
  const [gender, setGender] = useState("");
  const [isVerified, setIsVerified] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const {
    data: rawResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "admin-children",
      page,
      debouncedSearch,
      riskStatus,
      gender,
      isVerified,
    ],
    queryFn: async () => {
      const response = await api.get("/dashboard/admin/children", {
        params: {
          page,
          limit: 10,
          search: debouncedSearch,
          riskStatus,
          gender,
          isVerified,
        },
      });
      return response.data;
    },
  });

  const childrenData = rawResponse?.data?.data || [];
  const metaData = rawResponse?.data?.meta || {
    page: 1,
    totalPages: 1,
    total: 0,
  };

  // PASTIKAN SEMUA INI DI-RETURN
  return {
    children: childrenData,
    meta: metaData,
    isLoading,
    isError, // <--- Ini yang tadi hilang di return
    page,
    setPage,
    search,
    setSearch,
    riskStatus,
    setRiskStatus,
    gender,
    setGender,
    isVerified,
    setIsVerified,
    refetch,
  };
};
