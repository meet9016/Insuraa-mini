import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface UseCompanyListParams {
  page: number;
  limit: number;
  search: string;
}

export const useCompanyList = ({ page, limit, search }: UseCompanyListParams) => {
  return useQuery({
    queryKey: ['companyList', page, limit, search],
    queryFn: async () => {
      let resData;
      try {
        const response = await api.get(endPointApi.COMPANY.COMPANY_LIST, {
          params: { page, limit, search }
        });
        resData = response.data;
      } catch (err: any) {
        toast.error(err?.resData?.data?.message);
        return false;
      }
      const list = resData?.data?.company_list || resData?.data?.list || resData?.data || resData?.company_list || [];
      return Array.isArray(list) ? list : [];
    }
  });
};

// export const useCompanyList = ({ page, limit, search }: UseCompanyListParams) => {
//   return useQuery({
//     queryKey: ['companyList', page, limit, search],
//     queryFn: async () => {
//       let resData;
//       try {
//         const response = await api.get(endPointApi.COMPANY.COMPANY_LIST, {
//           params: { page, limit, search }
//         });
//         resData = response.data;
//       } catch (err) {
//         const formData = new FormData();
//         formData.append('page', String(page));
//         formData.append('limit', String(limit));
//         formData.append('search', search);
//         const response = await api.post(endPointApi.COMPANY.COMPANY_LIST, formData);
//         resData = response.data;
//       }
//       const list = resData?.data?.company_list || resData?.data?.list || resData?.data || resData?.company_list || [];
//       return Array.isArray(list) ? list : [];
//     }
//   });
// };




export const useCompanyPlans = (activeCompanyId: string | number) => {
  return useQuery({
    queryKey: ['companyPlans', activeCompanyId],
    enabled: !!activeCompanyId,
    queryFn: async () => {
      if (!activeCompanyId) return [];
      let resData;
      try {
        const formData = new FormData();
        formData.append('company_id', String(activeCompanyId));
        const response = await api.post(endPointApi.COMPANY.FETCH_COMPANY_PLANS, formData);
        resData = response.data;
      } catch (err: any) {
        // const response = await api.get(endPointApi.COMPANY.FETCH_COMPANY_PLANS, {
        //   params: { company_id: activeCompanyId }
        // });
        // resData = response.data;
        toast.error(err?.response?.data?.message);
        return false;
      }
      const list = resData?.data?.company_plans || resData?.data?.plans || resData?.data?.list || resData?.data || resData?.company_plans || [];
      return Array.isArray(list) ? list : [];
    }
  });
};



// export const useCompanyPlans = (activeCompanyId: string | number) => {
//   return useQuery({
//     queryKey: ['companyPlans', activeCompanyId],
//     enabled: !!activeCompanyId,
//     queryFn: async () => {
//       if (!activeCompanyId) return [];
//       let resData;
//       try {
//         const formData = new FormData();
//         formData.append('company_id', String(activeCompanyId));
//         const response = await api.post(endPointApi.COMPANY.FETCH_COMPANY_PLANS, formData);
//         resData = response.data;
//       } catch (err) {
//         const response = await api.get(endPointApi.COMPANY.FETCH_COMPANY_PLANS, {
//           params: { company_id: activeCompanyId }
//         });
//         resData = response.data;
//       }
//       const list = resData?.data?.company_plans || resData?.data?.plans || resData?.data?.list || resData?.data || resData?.company_plans || [];
//       return Array.isArray(list) ? list : [];
//     }
//   });
// };



export const useCompanyActions = () => {
  const queryClient = useQueryClient();
  const insertCompany = async (name: string, editingCompanyId?: string | number | null) => {
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (editingCompanyId) {
        formData.append("company_id", String(editingCompanyId));
      }
      const response = await api.post(endPointApi.COMPANY.INSERT_COMPANY, formData);
      const resData = response.data;
      if (resData?.status === 200) {
        toast.success(resData?.message);
        queryClient.invalidateQueries({
          queryKey: ["companyList"],
        });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message);
      return false;
    }
  };



  // const insertCompanyPlan = async (companyId: string | number, planName: string, editingPlanId?: string | number | null) => {
  //   const formData = new FormData();
  //   formData.append('company_id', String(companyId));
  //   formData.append('plan_name', planName.trim());

  //   if (editingPlanId) {
  //     formData.append('plan_id', String(editingPlanId));
  //     formData.append('id', String(editingPlanId));
  //   }

  //   let resData;
  //   try {
  //     const response = await api.post(endPointApi.COMPANY.INSERT_COMPANY_PLAN, formData);
  //     resData = response.data;
  //   } catch (err) {
  //     const payload: any = {
  //       company_id: String(companyId),
  //       plan_name: planName.trim()
  //     };
  //     if (editingPlanId) {
  //       payload.plan_id = String(editingPlanId);
  //       payload.id = String(editingPlanId);
  //     }
  //     const response = await api.post(endPointApi.COMPANY.INSERT_COMPANY_PLAN, payload);
  //     resData = response.data;
  //   }

  //   if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
  //     toast.success(resData?.message || (editingPlanId ? 'Plan updated successfully!' : 'Plan saved successfully!'));
  //     queryClient.invalidateQueries({ queryKey: ['companyPlans'] });
  //     queryClient.invalidateQueries({ queryKey: ['companyList'] });
  //     return true;
  //   } else {
  //     toast.error(resData?.message || 'Failed to save plan');
  //     return false;
  //   }
  // };


  const insertCompanyPlan = async (companyId: string | number, planName: string, editingPlanId?: string | number | null) => {
    const formData = new FormData();
    formData.append('company_id', String(companyId));
    formData.append('plan_name', planName.trim());

    if (editingPlanId) {
      formData.append('plan_id', String(editingPlanId));
    }

    let resData;
    try {
      const response = await api.post(endPointApi.COMPANY.INSERT_COMPANY_PLAN, formData);
      resData = response.data;

      if (resData?.status === 200) {
        toast.success(resData?.message);
        queryClient.invalidateQueries({ queryKey: ['companyPlans'] });
        queryClient.invalidateQueries({ queryKey: ['companyList'] });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.resData?.data?.message);
      return false;
    }
  };


  // const deleteCompany = async (companyId: string | number) => {
  //   const formData = new FormData();
  //   formData.append('company_id', String(companyId));

  //   let resData;
  //   try {
  //     const response = await api.post(endPointApi.COMPANY.DELETE_COMPANY, formData);
  //     resData = response.data;
  //   } catch (e) {
  //     const response = await api.delete(endPointApi.COMPANY.DELETE_COMPANY, {
  //       data: formData,
  //       params: { company_id: String(companyId) }
  //     });
  //     resData = response.data;
  //   }

  //   if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
  //     toast.success(resData?.message || 'Company deleted successfully!');
  //   } else {
  //     toast.error(resData?.message || 'Failed to delete company');
  //   }
  //   queryClient.invalidateQueries({ queryKey: ['companyList'] });
  // };


  const deleteCompany = async (companyId: string | number) => {
    const formData = new FormData();
    formData.append('company_id', String(companyId));

    let resData;
    try {
      const response = await api.post(endPointApi.COMPANY.DELETE_COMPANY, formData);
      resData = response.data;

      if (resData?.status === 200) {
        toast.success(resData?.message);
        queryClient.invalidateQueries({ queryKey: ['companyList'] });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.resData?.data?.message);
      return false;
    }
  };


  //   const deleteCompanyPlan = async (planId: string | number) => {
  //     const formData = new FormData();
  //     formData.append('plan_id', String(planId));

  //     let resData;
  //     try {
  //       const response = await api.post(endPointApi.COMPANY.DELETE_COMPANY_PLAN, formData);
  //       resData = response.data;
  //     } catch (e) {
  //       const response = await api.delete(endPointApi.COMPANY.DELETE_COMPANY_PLAN, {
  //         data: formData,
  //         params: { plan_id: String(planId) }
  //       });
  //       resData = response.data;
  //     }

  //     if (resData?.status === 200 || resData?.status === 'success' || resData?.status === true) {
  //       toast.success(resData?.message || 'Plan deleted successfully!');
  //     } else {
  //       toast.error(resData?.message || 'Failed to delete plan');
  //     }
  //     queryClient.invalidateQueries({ queryKey: ['companyPlans'] });
  //     queryClient.invalidateQueries({ queryKey: ['companyList'] });
  //   };

  //   return {
  //     insertCompany,
  //     insertCompanyPlan,
  //     deleteCompany,
  //     deleteCompanyPlan,
  //   };
  // };


  const deleteCompanyPlan = async (planId: string | number) => {
    const formData = new FormData();
    formData.append('plan_id', String(planId));
    let resData;
    try {
      const response = await api.post(endPointApi.COMPANY.DELETE_COMPANY_PLAN, formData);
      resData = response.data;

      if (resData?.status === 200) {
        toast.success(resData?.message);
        queryClient.invalidateQueries({ queryKey: ['companyPlans'] });
        queryClient.invalidateQueries({ queryKey: ['companyList'] });
        return true;
      }
    } catch (err: any) {
      toast.error(err?.resData?.data?.message);
      return false;
    }
  };

  return {
    insertCompany,
    insertCompanyPlan,
    deleteCompany,
    deleteCompanyPlan,
  };
};