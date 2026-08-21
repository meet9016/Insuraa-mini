export interface EndPointApi {
  AUTH: {
    SEND_LOGIN_OTP: string;
    VERIFY_LOGIN_OTP: string;
    SEND_SIGN_UP_OTP: string;
    VERIFY_SIGN_UP_OTP: string;
  };
  CUSTOMER: {
    CUSTOMER_LIST_DROP_DOWN: string;
    INSERT_CUSTOMER: string;
    CUSTOMER_LIST: string;
  };
  COMPANY: {
    INSERT_COMPANY: string;
    COMPANY_LIST: string;
    INSERT_COMPANY_PLAN: string;
    FETCH_COMPANY_PLANS: string;
    DELETE_COMPANY: string;
    DELETE_COMPANY_PLAN: string;
  };
  LIFE_COMPANY: {
    INSERT_COMPANY: string;
    COMPANY_LIST: string;
    INSERT_COMPANY_PLAN: string;
    FETCH_COMPANY_PLANS: string;
    DELETE_COMPANY: string;
    DELETE_COMPANY_PLAN: string;
  };
  RIDER: {
    INSERT_RIDER: string;
    RIDER_LIST: string;
    DELETE_RIDER: string;
  };
  DOCUMENT: {
    INSERT_DOCUMENT: string;
    DOCUMENT_LIST: string;
    DELETE_DOCUMENT: string;
  };
  SOURCE_OF_LEAD: {
    INSERT_LEAD_PRODUCT: string;
    LEAD_PRODUCT_LIST: string;
    DELETE_LEAD_PRODUCT: string;
  };
  GENERAL_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: string;
    INSERT_AGENCY_CODE: string;
    AGENCY_CODE_LIST: string;
    DELETE_AGENCY_CODE: string;
  };
  LIFE_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: string;
    INSERT_AGENCY_CODE: string;
    AGENCY_CODE_LIST: string;
    DELETE_AGENCY_CODE: string;
  };
}

// Define and export the standard API endpoint object
const endPointApi: EndPointApi = {
  AUTH: {
    SEND_LOGIN_OTP: 'send_login_otp',
    VERIFY_LOGIN_OTP: 'verify_login_otp',
    SEND_SIGN_UP_OTP: 'send_sign_up_otp',
    VERIFY_SIGN_UP_OTP: 'verify_sign_up_otp',
  },
  CUSTOMER: {
    CUSTOMER_LIST_DROP_DOWN: 'customer_list_drop_down',
    INSERT_CUSTOMER: 'insert_customer',
    CUSTOMER_LIST: 'customer_list',
  },
  COMPANY: {
    INSERT_COMPANY: 'insert_company',
    COMPANY_LIST: 'company_list',
    INSERT_COMPANY_PLAN: 'insert_company_plan',
    FETCH_COMPANY_PLANS: 'fetch_company_plans',
    DELETE_COMPANY: 'delete_company',
    DELETE_COMPANY_PLAN: 'delete_company_plan',
  },
  LIFE_COMPANY: {
    INSERT_COMPANY: 'insert_company_life',
    COMPANY_LIST: 'company_list_life',
    INSERT_COMPANY_PLAN: 'insert_company_plan_life',
    FETCH_COMPANY_PLANS: 'fetch_company_plans_life',
    DELETE_COMPANY: 'delete_company_life',
    DELETE_COMPANY_PLAN: 'delete_company_plan_life',
  },
  RIDER: {
    INSERT_RIDER: 'insert_life_insurance_riders',
    RIDER_LIST: 'life_insurance_riders_list',
    DELETE_RIDER: 'delete_life_insurance_riders',
  },
  DOCUMENT: {
    INSERT_DOCUMENT: 'insert_document_name',
    DOCUMENT_LIST: 'document_name_list',
    DELETE_DOCUMENT: 'delete_document_name',
  },
  SOURCE_OF_LEAD: {
    INSERT_LEAD_PRODUCT: 'insert_lead_product',
    LEAD_PRODUCT_LIST: 'lead_product_list',
    DELETE_LEAD_PRODUCT: 'delete_lead_product',
  },
  GENERAL_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: 'company_dropdown_list',
    INSERT_AGENCY_CODE: 'insert_agency_code',
    AGENCY_CODE_LIST: 'agency_code_list',
    DELETE_AGENCY_CODE: 'delete_agency_code',
  },
  LIFE_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: 'company_dropdown_list_life',
    INSERT_AGENCY_CODE: 'insert_agency_code_life',
    AGENCY_CODE_LIST: 'agency_code_list_life',
    DELETE_AGENCY_CODE: 'delete_agency_code_life',
  },
};

export default endPointApi;


