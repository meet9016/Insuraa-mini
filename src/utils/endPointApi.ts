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
};

export default endPointApi;


