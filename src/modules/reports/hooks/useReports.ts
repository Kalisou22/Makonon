import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/reportService';

export const useReports = (options: {
  type: 'transfers' | 'fees' | 'cash' | 'ledger' | 'audit' | 'clients' | 'agencies';
  params?: Record<string, any>;
  enabled?: boolean;
}) => {
  const { type, params = {}, enabled = true } = options;

  const getQueryFn = () => {
    switch (type) {
      case 'transfers':
        return () => reportService.getTransfers(params);
      case 'fees':
        return () => reportService.getFees(params);
      case 'cash':
        return () => reportService.getCash(params);
      case 'ledger':
        return () => reportService.getLedger(params);
      case 'audit':
        return () => reportService.getAudit(params);
      case 'clients':
        return () => reportService.getClients(params);
      case 'agencies':
        return () => reportService.getAgencies();
      default:
        return () => reportService.getTransfers(params);
    }
  };

  return useQuery({
    queryKey: ['reports', type, params],
    queryFn: getQueryFn(),
    enabled,
    staleTime: 30000,
  });
};

export default useReports;
