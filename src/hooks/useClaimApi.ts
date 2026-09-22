import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/axiosInstance';
import endPointApi from '@/utils/endPointApi';
import { toast } from 'react-toastify';

export interface ClaimMasterItem {
    id: number | string;
    value: string;
}

export interface ClaimMasterData {
    insurance_type?: ClaimMasterItem[];
    claim_status?: ClaimMasterItem[];
    hospital_rating?: ClaimMasterItem[];
}

export const useClaimMasterData = () => {
    return useQuery<ClaimMasterData>({
        queryKey: ['claimMasterData'],
        queryFn: async () => {
            try {
                const response = await api.post(endPointApi.CLAIM.CLAIM_MASTER_DATA);
                const resData = response?.data;
                return resData?.data || {};
            } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Error fetching claim master data');
                return {};
            }
        },
    });
};

export interface InsuranceTypeItem {
    id: number | string;
    name: string;
    value?: string;
}

export const useInsuranceTypeList = () => {
    return useQuery<InsuranceTypeItem[]>({
        queryKey: ['insuranceTypeList'],
        queryFn: async () => {
            try {
                const response = await api.post(endPointApi.CLAIM.INSURANCE_TYPE_LIST);
                const resData = response?.data;
                const list = Array.isArray(resData?.data) ? resData.data : (resData?.data?.list || resData?.list || []);
                return Array.isArray(list) ? list : [];
            } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Error fetching insurance type list');
                return [];
            }
        },
    });
};

export interface UseClaimCustomerPolicyDropdownParams {
    customer_id?: string | number;
    insurance_type_id?: string | number;
}

export const useClaimCustomerPolicyDropdown = ({
    customer_id,
    insurance_type_id,
}: UseClaimCustomerPolicyDropdownParams) => {
    return useQuery({
        queryKey: ['claimCustomerPolicyDropdown', customer_id, insurance_type_id],
        queryFn: async () => {
            if (!customer_id || !insurance_type_id) {
                return [];
            }
            try {
                const formData = new FormData();
                formData.append('customer_id', String(customer_id));
                formData.append('insurance_type_id', String(insurance_type_id));
                formData.append('insurance_type', String(insurance_type_id));
                formData.append('customer_insurance_id', String(insurance_type_id));

                const response = await api.post(endPointApi.CLAIM.CLAIM_CUSTOMER_POLICY_DROPDOWN, formData);
                const resData = response?.data;
                const list = Array.isArray(resData?.data) ? resData.data : (resData?.data?.list || resData?.list || []);
                return Array.isArray(list) ? list : [];
            } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Error fetching customer policy list');
                return [];
            }
        },
        enabled: Boolean(customer_id && insurance_type_id),
    });
};

export interface ClaimPayload {
    id?: string | number;
    claim_id?: string | number;
    customer_id: string | number;
    insurance_type: string | number;
    customer_insurance_id: string | number;
    admited_date?: string;
    discharge_date?: string;
    calim_amount?: string | number;
    deducted_amount?: string | number;
    setteled_amount?: string | number;
    claim_number?: string;
    file_at_office?: string;
    file_at_company?: string;
    next_followup_date?: string;
    query?: string;
    claim_satteled_date?: string;
    diagnosis?: string;
    claim_status?: string | number;
    name_of_doctor?: string;
    name_of_hospital?: string;
    location_of_hospital?: string;
    hospital_type?: string;
    rating_of_hospital?: string | number;
    note?: string;
    [key: string]: any;
}

export const formatToYYYYMMDD = (val?: any): string => {
    if (!val) return '';
    const str = String(val).trim();
    if (!str || str === 'null' || str === 'undefined') return '';

    const cleanVal = str.split(' ')[0].split('T')[0];

    // DD-MM-YYYY or DD/MM/YYYY -> YYYY-MM-DD
    if (/^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/.test(cleanVal)) {
        const parts = cleanVal.split(/[-/]/);
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        const year = parts[2];
        return `${year}-${month}-${day}`;
    }

    // YYYY-MM-DD or YYYY/MM/DD -> YYYY-MM-DD
    if (/^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/.test(cleanVal)) {
        const parts = cleanVal.split(/[-/]/);
        const year = parts[0];
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    return cleanVal;
};

const DATE_FIELDS = [
    'admited_date',
    'admitted_date',
    'discharge_date',
    'file_at_office',
    'file_at_company',
    'next_followup_date',
    'query',
    'query_date',
    'claim_satteled_date',
    'claim_settled_date',
];

export const useClaimActions = () => {
    const queryClient = useQueryClient();

    const saveClaimMutation = useMutation({
        mutationFn: async (payload: ClaimPayload) => {
            const formData = new FormData();
            const claimId = payload.id || payload.claim_id;
            const isEdit = Boolean(claimId);

            if (isEdit) {
                formData.append('id', String(claimId));
            }

            Object.keys(payload).forEach((key) => {
                if (key !== 'id' && key !== 'claim_id' && payload[key] !== undefined && payload[key] !== null) {
                    let val = String(payload[key]);
                    if (DATE_FIELDS.includes(key)) {
                        val = formatToYYYYMMDD(val);
                    }
                    formData.append(key, val);
                }
            });

            const endpoint = isEdit ? endPointApi.CLAIM.EDIT_CLAIM : endPointApi.CLAIM.INSERT_CLAIM;
            const response = await api.post(endpoint, formData);
            return response?.data;
        },
        onSuccess: (data, variables) => {
            const isEdit = Boolean(variables.id || variables.claim_id);
            if (data?.status === 200 || data?.status === 201 || data?.status === '200' || data?.status === 'success') {
                toast.success(data?.message || (isEdit ? 'Claim updated successfully!' : 'Claim inserted successfully!'));
                queryClient.invalidateQueries({ queryKey: ['claimList'] });
            } else {
                toast.error(data?.message || (isEdit ? 'Failed to update claim' : 'Failed to insert claim'));
            }
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'Error saving claim');
        },
    });

    const deleteClaim = async (claimId: string | number) => {
        try {
            const formData = new FormData();
            formData.append('id', String(claimId));

            const response = await api.post(endPointApi.CLAIM.DELETE_CLAIM, formData);
            const resData = response?.data;

            if (resData?.status === 200 || resData?.status === '200' || resData?.success || resData?.status === 'success') {
                toast.success(resData?.message || 'Claim deleted successfully!');
                queryClient.invalidateQueries({ queryKey: ['claimList'] });
                return true;
            } else {
                toast.error(resData?.message || 'Failed to delete claim');
                return false;
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Error deleting claim');
            return false;
        }
    };

    return {
        insertClaim: saveClaimMutation.mutateAsync,
        editClaim: saveClaimMutation.mutateAsync,
        isSubmitting: saveClaimMutation.isPending,
        isInserting: saveClaimMutation.isPending,
        deleteClaim,
    };
};

export interface ClaimListParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface ClaimListItem {
    claim_id?: number | string;
    claim_number?: string;
    customer_id?: string | number;
    customer_name?: string;
    mobile?: string;
    insurance_type?: string | number;
    customer_insurance_id?: string | number;
    claim_amount?: number | string;
    deducted_amount?: number | string;
    settled_amount?: number | string;
    admitted_date?: string;
    discharge_date?: string;
    file_at_office?: string;
    file_at_company?: string;
    next_followup_date?: string;
    query_date?: string;
    claim_settled_date?: string;
    claim_status?: string | number;
    diagnosis?: string;
    doctor_name?: string;
    hospital_name?: string;
    hospital_location?: string;
    hospital_type?: string;
    rating_of_hospital?: string | number;
    note?: string;
    created_at?: string;
    [key: string]: any;
}

export interface ClaimListResponse {
    claimList: ClaimListItem[];
    totalRecords: number;
    page: number;
    limit: number;
}

export const useClaimList = ({ page = 1, limit = 10, search = '' }: ClaimListParams = {}) => {
    return useQuery<ClaimListResponse>({
        queryKey: ['claimList', page, limit, search],
        queryFn: async () => {
            try {
                const formData = new FormData();
                formData.append('page', String(page));
                formData.append('limit', String(limit));
                formData.append('search', search ?? '');

                const response = await api.post(endPointApi.CLAIM.CLAIM_LIST, formData);
                const resData = response?.data;
                const claimList = Array.isArray(resData?.data) ? resData.data : [];
                const totalRecords = resData?.pagination_arr?.total_records ?? resData?.total_records ?? claimList.length ?? 0;

                return {
                    claimList,
                    totalRecords,
                    page,
                    limit,
                };
            } catch (err: any) {
                toast.error(err?.response?.data?.message || 'Error fetching claim list');
                return {
                    claimList: [],
                    totalRecords: 0,
                    page,
                    limit,
                };
            }
        },
    });
};



