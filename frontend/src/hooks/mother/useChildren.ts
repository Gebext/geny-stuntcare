import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useMotherChildren = () => {
  return useQuery({
    queryKey: ["mother-children-list"],
    queryFn: async () => {
      const res = await api.get("/children/me");
      console.log("Raw Response:", res.data);
      return res.data?.data?.data || [];
    },
  });
};
