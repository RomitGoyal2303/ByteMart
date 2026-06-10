import { api } from "@/utils/api-client";
import type { MutationConfig } from "@/utils/react-query";
import { useMutation } from "@tanstack/react-query";

export const logout = () => {
  return api.post("auth/signout");
};

export const useLogout = ({
  mutationConfig,
}: {
  mutationConfig?: MutationConfig<typeof logout>;
} = {}) => {
  return useMutation({
    mutationFn: logout,
    ...mutationConfig,
  });
};
