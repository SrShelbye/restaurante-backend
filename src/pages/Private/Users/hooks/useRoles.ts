import { IRole } from '@/models';
import { useQuery } from '@tanstack/react-query';
import { getRoles } from '../services/roles.service';
import { queryKeys } from '@/api/query-keys';

/* */
export const useRoles = () => {
  const rolesQuery = useQuery<IRole[]>({
    queryKey: queryKeys.roles.all,
    queryFn: () => getRoles()
  });

  return {
    rolesQuery
  };
};
