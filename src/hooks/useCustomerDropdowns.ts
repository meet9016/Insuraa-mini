import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';

export interface DropdownItem {
  id: string | number;
  name: string;
}

export interface CustomerDropdownsData {
  customer_type?: DropdownItem[];
  gender?: DropdownItem[];
  marital_status?: DropdownItem[];
  education?: DropdownItem[];
  document_name?: DropdownItem[];
}

export const useCustomerDropdowns = () => {
  return useQuery<CustomerDropdownsData>({
    queryKey: ['customerListDropDown'],
    queryFn: async () => {
      const response = await api.get(endPointApi.CUSTOMER.CUSTOMER_LIST_DROP_DOWN);
      const resData = response.data;
      return resData?.data || resData || {};
    },
  });
};
