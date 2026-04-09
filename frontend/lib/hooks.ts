import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getVacancies, getVacancy, createVacancy, updateVacancy, deleteVacancy } from "@/lib/api";
import { Vacancy, CreateVacancyPayload } from "@/types/vacancy";

export function useVacancies(title?: string) {
  return useQuery<Vacancy[]>({
    queryKey: ["vacancies", title],
    queryFn: () => getVacancies(title),
  });
}

export function useVacancy(id: number) {
  return useQuery<Vacancy>({
    queryKey: ["vacancy", id],
    queryFn: () => getVacancy(id),
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();
  return useMutation<Vacancy, Error, CreateVacancyPayload>({
    mutationFn: (data) => createVacancy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
    },
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();
  return useMutation<Vacancy, Error, { id: number; data: CreateVacancyPayload }>({
    mutationFn: ({ id, data }) => updateVacancy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
    },
  });
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => deleteVacancy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vacancies"] });
    },
  });
}
