import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export interface AppSettingsData {
  company_name: string;
  mobile_number: string;
  whatsapp_number: string;
  email: string;
  logo: string;
  favicon: string;
  login_page_image: string[];
}

export const useFetchAppSettings = () => {
  return useQuery({
    queryKey: ['appSettingsData'],
    queryFn: async () => {
      try {
        const response = await api.post(endPointApi.SETTINGS.APP_SETTINGS);
        const resData = response.data;
        if (resData && (resData.status === 200 || resData.status === '200' || resData.status === 'success')) {
          return (resData?.data as AppSettingsData) || null;
        } else {
          return null;
        }
      } catch (err: any) {
        console.error('Error fetching app settings', err);
        return null;
      }
    },
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
