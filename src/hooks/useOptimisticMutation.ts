import { useToast } from "@chakra-ui/react";
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export type useOptimisticMutationProps<TData, TValues, TMutationResp> = {
  queryKey: QueryKey;
  keysToInvalidate?: QueryKey[];
  queryFn: () => TData | Promise<TData>;
  mutationFn: (values: TValues) => Promise<TMutationResp>;
  getOptimisticValues?: (prevData: TData, values: TValues) => TData;
  onSuccess?: () => void;
  beforeMutate?: () => void;
};
export default function useOptimisticMutation<TData, TValues, TMutationResp>({
  keysToInvalidate,
  queryKey,
  queryFn,
  mutationFn,
  onSuccess,
  beforeMutate,
  getOptimisticValues = (prevData, values) => ({ ...prevData, ...values }),
}: useOptimisticMutationProps<TData, TValues, TMutationResp>) {
  const toast = useToast();

  const { data } = useQuery({
    queryKey,
    queryFn,
  });

  const queryClient = useQueryClient();

  const { mutate, mutateAsync, isSuccess } = useMutation({
    mutationFn: mutationFn,
    onMutate: async (newData) => {
      beforeMutate?.();
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey) as TData;
      queryClient.setQueryData(
        queryKey,
        getOptimisticValues(previousData, newData)
      );
      return { previousData, newData };
    },
    onError: (err, newData, context) => {
      toast({
        title: "Error",
        colorScheme: "red",
      });
      queryClient.setQueryData(queryKey, context?.previousData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Data was successfully updated",
        colorScheme: "green",
      });
      keysToInvalidate?.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key })
      );
      queryClient.invalidateQueries({ queryKey });
      onSuccess?.();
    },
  });

  return { mutate, mutateAsync, isSuccess, data };
}
