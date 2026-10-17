export interface EndPointApi {
  AUTH: {
    SEND_LOGIN_OTP: string;
    VERIFY_LOGIN_OTP: string;
    SEND_SIGN_UP_OTP: string;
    VERIFY_SIGN_UP_OTP: string;
    PLAN_LIST: string;
    DIRECT_PLAN_INFO: string;
    SUBSCRIPTION_POPUP: string;
    SUBSCRIPTION_LIST: string;
    INVOICE_LIST: string;
    POLICY_ADDON_PURCHASE: string;
    POLICY_ADDON_HISTORY: string;
  };
  CUSTOMER: {
    CUSTOMER_LIST_DROP_DOWN: string;
    INSERT_CUSTOMER: string;
    CUSTOMER_LIST: string;
    GET_PINCODE_DETAILS: string;
    BULK_DELETE_CUSTOMER: string;
    SINGLE_CUSTOMER_LIST: string;
  };
  COMPANY: {
    INSERT_COMPANY: string;
    COMPANY_LIST: string;
    INSERT_COMPANY_PLAN: string;
    FETCH_COMPANY_PLANS: string;
    DELETE_COMPANY: string;
    DELETE_COMPANY_PLAN: string;
    BULK_DELETE_COMPANY: string;
    BULK_DELETE_COMPANY_PLAN: string;
  };
  LIFE_COMPANY: {
    INSERT_COMPANY: string;
    COMPANY_LIFE_LIST: string;
    INSERT_COMPANY_PLAN: string;
    FETCH_COMPANY_PLANS: string;
    DELETE_COMPANY: string;
    DELETE_COMPANY_PLAN: string;
    BULK_DELETE_COMPANY_LIFE: string;
    BULK_DELETE_COMPANY_PLAN_LIFE: string;
  };
  RIDER: {
    INSERT_RIDER: string;
    RIDER_LIST: string;
    DELETE_RIDER: string;
    BULK_DELETE_RIDER: string;
  };
  DOCUMENT: {
    INSERT_DOCUMENT: string;
    DOCUMENT_LIST: string;
    DELETE_DOCUMENT: string;
    BULK_DELETE_DOCUMENT: string;
  };
  SOURCE_OF_LEAD: {
    INSERT_LEAD_PRODUCT: string;
    LEAD_PRODUCT_LIST: string;
    DELETE_LEAD_PRODUCT: string;
    BULK_DELETE_LEAD_PRODUCT: string;
  };
  GENERAL_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: string;
    INSERT_AGENCY_CODE: string;
    AGENCY_CODE_LIST: string;
    DELETE_AGENCY_CODE: string;
    BULK_DELETE_AGENCY_CODE: string;
  };
  LIFE_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: string;
    INSERT_AGENCY_CODE: string;
    AGENCY_CODE_LIST: string;
    DELETE_AGENCY_CODE: string;
    BULK_DELETE_AGENCY_CODE: string;
  };
  LEAD: {
    INSERT_LEAD: string;
    KANBAN_LIST: string;
    KANBAN_LOAD_MORE: string;
    BUSINESS_GROUPS_DROPDOWN: string;
    LEAD_PRODUCT_DROPDOWN: string;
    LEAD_TABLE_LIST: string;
    DELETE_LEAD: string;
    INSERT_LEAD_NOTE: string;
    LEAD_NOTE_LIST: string;
    DELETE_LEAD_NOTE: string;
    INSERT_LEAD_REMINDER: string;
    LEAD_REMINDER_LIST: string;
    DELETE_LEAD_REMINDER: string;
    UPDATE_LEAD_STATUS: string;
    BULK_DELETE_LEAD: string;
  };
  LIFE_INSURANCE: {
    INSERT_LIFE_INSURANCE: string;
    LIFE_INSURANCE_MASTER_DATA: string;
    LIFE_INSURANCE_COMPANY_PLANS_AND_AGENCY: string;
    LIFE_INSURANCE_LIST: string;
    DELETE_LIFE_INSURANCE: string;
    BULK_DELETE_LIFE_INSURANCE: string;
    VIEW_LIFE_INSURANCE: string;
    AI_READ_POLICY: string;
    UPDATE_LIFE_INSTALLMENT_STATUS: string;
  };
  HEALTH_INSURANCE: {
    INSERT_HEALTH_INSURANCE: string;
    HEALTH_INSURANCE_MASTER_DATA: string;
    HEALTH_INSURANCE_COMPANY_PLANS_AND_AGENCY: string;
    HEALTH_INSURANCE_LIST: string;
    DELETE_HEALTH_INSURANCE: string;
    BULK_DELETE_HEALTH_INSURANCE: string;
    VIEW_HEALTH_INSURANCE: string;
    AI_READ_POLICY: string;
  };
  MOTOR_INSURANCE: {
    INSERT_MOTOR_INSURANCE: string;
    MOTOR_INSURANCE_MASTER_DATA: string;
    MOTOR_INSURANCE_COMPANY_PLANS_AND_AGENCY: string;
    MOTOR_INSURANCE_LIST: string;
    DELETE_MOTOR_INSURANCE: string;
    BULK_DELETE_MOTOR_INSURANCE: string;
    VIEW_MOTOR_INSURANCE: string;
    AI_READ_POLICY: string;
  };
  HEALTH_QUOTATION: {
    HEALTH_QUOTATION_MASTER_DATA: string;
    INSERT_HEALTH_QUOTATION: string;
    HEALTH_QUOTATION_PRODUCT_LIST_DROPDOWN: string;
    HEALTH_QUOTATION_LIST: string;
    DELETE_HEALTH_QUOTATION: string;
    BULK_DELETE_HEALTH_QUOTATION: string;
    HEALTH_QUOTATION_EDIT: string;
  };
  MOTOR_QUOTATION: {
    MOTOR_QUOTATION_MASTER_DATA: string;
    INSERT_MOTOR_QUOTATION: string;
    MOTOR_QUOTATION_PRODUCT_LIST_DROPDOWN: string;
    MOTOR_QUOTATION_LIST: string;
    DELETE_MOTOR_QUOTATION: string;
    BULK_DELETE_MOTOR_QUOTATION: string;
    MOTOR_QUOTATION_EDIT: string;
  };
  CLAIM: {
    CLAIM_MASTER_DATA: string;
    CLAIM_CUSTOMER_POLICY_DROPDOWN: string;
    INSERT_CLAIM: string;
    INSURANCE_TYPE_LIST: string;
    CLAIM_LIST: string;
    DELETE_CLAIM: string;
    BULK_DELETE_CLAIM: string;
    EDIT_CLAIM: string;
  };
  OTHER_INSURANCE: {
    INSERT_OTHER_INSURANCE: string;
    OTHER_INSURANCE_MASTER_DATA: string;
    OTHER_INSURANCE_COMPANY_PLANS_AND_AGENCY: string;
    OTHER_INSURANCE_LIST: string;
    DELETE_OTHER_INSURANCE: string;
    BULK_DELETE_OTHER_INSURANCE: string;
    VIEW_OTHER_INSURANCE: string;
    AI_READ_POLICY: string;
  };
  DASHBOARD: {
    DASHBOARD_SUMMARY: string;
    DASHBOARD_CALENDAR_EVENTS: string;
    DASHBOARD_DAY_DETAILS: string;
    DASHBOARD_PAYMENT_PENDING: string;
    DASHBOARD_RENEWAL_TYPE_LIST: string;
    DASHBOARD_RENEWAL_PENDING: string;
    DASHBOARD_CHART_COMPANY: string;
    DASHBOARD_CHART_TYPE: string;
    DASHBOARD_CHART_POLICY: string;
  };
  PROFILE: {
    FETCH_PROFILE: string;
    UPDATE_PROFILE: string;
  };
  STAFF: {
    INSERT_STAFF: string;
    STAFF_LIST: string;
    VIEW_STAFF: string;
    DELETE_STAFF: string;
    UPDATE_STAFF_STATUS: string;
    BULK_DELETE_STAFF: string;
  };
  AI_CREDIT: {
    AI_CREDIT_INFO: string;
    AI_CREDIT_QUOTE: string;
    AI_CREDIT_PURCHASE: string;
    AI_CREDIT_HISTORY: string;
  };
  SETTINGS: {
    APP_SETTINGS: string;
  };
  SEARCH: {
    GLOBAL_SEARCH: string;
  };
  PRICING: {
    DIRECT_PLAN_INFO: string;
    DIRECT_PLAN_QUOTE: string;
    DIRECT_VERIFY_OTP: string;
    DIRECT_PLAN_PURCHASE: string;
    GST_VERIFY: string;
    POLICY_PLAN_INFO: string;
    POLICY_PLAN_QUOTE: string;
    POLICY_PLAN_PURCHASE: string;
    POLICY_ADDON_PURCHASE: string;
    POLICY_ADDON_HISTORY: string;
  };
}

// Define and export the standard API endpoint object
const endPointApi: EndPointApi = {
  PROFILE: {
    FETCH_PROFILE: 'profile',
    UPDATE_PROFILE: 'update_profile',
  },
  STAFF: {
    INSERT_STAFF: 'insert_staff',
    STAFF_LIST: 'staff_list',
    VIEW_STAFF: 'view_staff',
    DELETE_STAFF: 'delete_staff',
    UPDATE_STAFF_STATUS: 'update_staff_status',
    BULK_DELETE_STAFF: 'bulk_delete_staff',
  },
  AUTH: {
    SEND_LOGIN_OTP: 'send_login_otp',
    VERIFY_LOGIN_OTP: 'verify_login_otp',
    SEND_SIGN_UP_OTP: 'send_sign_up_otp',
    VERIFY_SIGN_UP_OTP: 'verify_sign_up_otp',
    PLAN_LIST: 'plan_list',
    DIRECT_PLAN_INFO: 'direct_plan_info',
    SUBSCRIPTION_POPUP: 'subscription_popup',
    SUBSCRIPTION_LIST: 'subscription_list',
    INVOICE_LIST: 'invoice_list',
    POLICY_ADDON_PURCHASE: 'policy_addon_purchase',
    POLICY_ADDON_HISTORY: 'policy_addon_history',
  },
  CUSTOMER: {
    CUSTOMER_LIST_DROP_DOWN: 'customer_list_drop_down',
    INSERT_CUSTOMER: 'insert_customer',
    CUSTOMER_LIST: 'customer_list',
    GET_PINCODE_DETAILS: 'getPincodeDetails',
    BULK_DELETE_CUSTOMER: 'bulk_delete_customer',
    SINGLE_CUSTOMER_LIST: 'single_customer_list',
  },
  COMPANY: {
    INSERT_COMPANY: 'insert_company',
    COMPANY_LIST: 'company_list',
    INSERT_COMPANY_PLAN: 'insert_company_plan',
    FETCH_COMPANY_PLANS: 'fetch_company_plans',
    DELETE_COMPANY: 'delete_company',
    DELETE_COMPANY_PLAN: 'delete_company_plan',
    BULK_DELETE_COMPANY: 'bulk_delete_company',
    BULK_DELETE_COMPANY_PLAN: 'bulk_delete_company_plan',
  },
  LIFE_COMPANY: {
    INSERT_COMPANY: 'insert_company_life',
    COMPANY_LIFE_LIST: 'company_list_life',
    INSERT_COMPANY_PLAN: 'insert_company_plan_life',
    FETCH_COMPANY_PLANS: 'fetch_company_plans_life',
    DELETE_COMPANY: 'delete_company_life',
    DELETE_COMPANY_PLAN: 'delete_company_plan_life',
    BULK_DELETE_COMPANY_LIFE: 'bulk_delete_company_life',
    BULK_DELETE_COMPANY_PLAN_LIFE: 'bulk_delete_company_plan_life',
  },
  RIDER: {
    INSERT_RIDER: 'insert_life_insurance_riders',
    RIDER_LIST: 'life_insurance_riders_list',
    DELETE_RIDER: 'delete_life_insurance_riders',
    BULK_DELETE_RIDER: 'bulk_delete_life_insurance_riders',
  },
  DOCUMENT: {
    INSERT_DOCUMENT: 'insert_document_name',
    DOCUMENT_LIST: 'document_name_list',
    DELETE_DOCUMENT: 'delete_document_name',
    BULK_DELETE_DOCUMENT: 'bulk_delete_document_name',
  },
  SOURCE_OF_LEAD: {
    INSERT_LEAD_PRODUCT: 'insert_lead_product',
    LEAD_PRODUCT_LIST: 'lead_product_list',
    DELETE_LEAD_PRODUCT: 'delete_lead_product',
    BULK_DELETE_LEAD_PRODUCT: 'bulk_delete_lead_product',
  },
  GENERAL_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: 'company_dropdown_list',
    INSERT_AGENCY_CODE: 'insert_agency_code',
    AGENCY_CODE_LIST: 'agency_code_list',
    DELETE_AGENCY_CODE: 'delete_agency_code',
    BULK_DELETE_AGENCY_CODE: 'bulk_delete_agency_code',
  },
  LIFE_AGENCY_CODE: {
    COMPANY_DROPDOWN_LIST: 'company_dropdown_list_life',
    INSERT_AGENCY_CODE: 'insert_agency_code_life',
    AGENCY_CODE_LIST: 'agency_code_list_life',
    DELETE_AGENCY_CODE: 'delete_agency_code_life',
    BULK_DELETE_AGENCY_CODE: 'bulk_delete_agency_code_life',
  },
  LEAD: {
    INSERT_LEAD: 'insert_lead',
    KANBAN_LIST: 'lead_list_kanban_list',
    KANBAN_LOAD_MORE: 'lead_list_kanban_load_more',
    BUSINESS_GROUPS_DROPDOWN: 'business_groups_dropdown_list',
    LEAD_PRODUCT_DROPDOWN: 'lead_product_dropdown_list',
    LEAD_TABLE_LIST: 'lead_list_table_list',
    DELETE_LEAD: 'delete_lead',
    INSERT_LEAD_NOTE: 'insert_lead_note',
    LEAD_NOTE_LIST: 'lead_note_list',
    DELETE_LEAD_NOTE: 'delete_lead_note',
    INSERT_LEAD_REMINDER: 'insert_lead_reminder',
    LEAD_REMINDER_LIST: 'lead_reminder_list',
    DELETE_LEAD_REMINDER: 'delete_lead_reminder',
    UPDATE_LEAD_STATUS: 'update_lead_status',
    BULK_DELETE_LEAD: 'bulk_delete_lead',
  },
  LIFE_INSURANCE: {
    INSERT_LIFE_INSURANCE: 'insert_life_insurance',
    LIFE_INSURANCE_MASTER_DATA: 'life_insurance_master_data',
    LIFE_INSURANCE_COMPANY_PLANS_AND_AGENCY: 'life_insurance_company_plans_and_agency',
    LIFE_INSURANCE_LIST: 'life_insurance_list',
    DELETE_LIFE_INSURANCE: 'delete_life_insurance',
    BULK_DELETE_LIFE_INSURANCE: 'bulk_delete_life_insurance',
    VIEW_LIFE_INSURANCE: 'view_life_insurance',
    AI_READ_POLICY: 'ai_read_policy',
    UPDATE_LIFE_INSTALLMENT_STATUS: 'update_life_installment_status',
  },
  HEALTH_INSURANCE: {
    INSERT_HEALTH_INSURANCE: 'insert_health_insurance',
    HEALTH_INSURANCE_MASTER_DATA: 'health_insurance_master_data',
    HEALTH_INSURANCE_COMPANY_PLANS_AND_AGENCY: 'health_insurance_company_plans_and_agency',
    HEALTH_INSURANCE_LIST: 'health_insurance_list',
    DELETE_HEALTH_INSURANCE: 'delete_health_insurance',
    BULK_DELETE_HEALTH_INSURANCE: 'bulk_delete_health_insurance',
    VIEW_HEALTH_INSURANCE: 'view_health_insurance',
    AI_READ_POLICY: 'ai_read_policy',
  },
  MOTOR_INSURANCE: {
    INSERT_MOTOR_INSURANCE: 'insert_motor_insurance',
    MOTOR_INSURANCE_MASTER_DATA: 'motor_insurance_master_data',
    MOTOR_INSURANCE_COMPANY_PLANS_AND_AGENCY: 'motor_insurance_company_plans_and_agency',
    MOTOR_INSURANCE_LIST: 'motor_insurance_list',
    DELETE_MOTOR_INSURANCE: 'delete_motor_insurance',
    BULK_DELETE_MOTOR_INSURANCE: 'bulk_delete_motor_insurance',
    VIEW_MOTOR_INSURANCE: 'view_motor_insurance',
    AI_READ_POLICY: 'ai_read_policy',
  },
  HEALTH_QUOTATION: {
    HEALTH_QUOTATION_MASTER_DATA: 'health_quotation_master_data',
    INSERT_HEALTH_QUOTATION: 'insert_health_quotation',
    HEALTH_QUOTATION_PRODUCT_LIST_DROPDOWN: 'health_quotation_product_list_dropdown',
    HEALTH_QUOTATION_LIST: 'health_insurance_qution_list',
    DELETE_HEALTH_QUOTATION: 'delete_health_quotation',
    BULK_DELETE_HEALTH_QUOTATION: 'bulk_delete_health_quotation',
    HEALTH_QUOTATION_EDIT: 'health_quotation_edit',
  },
  MOTOR_QUOTATION: {
    MOTOR_QUOTATION_MASTER_DATA: 'motor_quotation_master_data',
    INSERT_MOTOR_QUOTATION: 'insert_motor_quotation',
    MOTOR_QUOTATION_PRODUCT_LIST_DROPDOWN: 'motor_quotation_product_list_dropdown',
    MOTOR_QUOTATION_LIST: 'motor_quotation_list',
    DELETE_MOTOR_QUOTATION: 'delete_motor_quotation',
    BULK_DELETE_MOTOR_QUOTATION: 'bulk_delete_motor_quotation',
    MOTOR_QUOTATION_EDIT: 'motor_quotation_edit',
  },
  CLAIM: {
    CLAIM_MASTER_DATA: 'claim_master_data',
    CLAIM_CUSTOMER_POLICY_DROPDOWN: 'claim_customer_policy_dropdown',
    INSERT_CLAIM: 'insert_claim',
    INSURANCE_TYPE_LIST: 'insurance_type_list',
    CLAIM_LIST: 'claim_list',
    DELETE_CLAIM: 'delete_claim',
    BULK_DELETE_CLAIM: 'bulk_delete_claim',
    EDIT_CLAIM: 'edit_claim',
  },
  OTHER_INSURANCE: {
    INSERT_OTHER_INSURANCE: 'insert_other_insurance',
    OTHER_INSURANCE_MASTER_DATA: 'other_insurance_master_data',
    OTHER_INSURANCE_COMPANY_PLANS_AND_AGENCY: 'other_insurance_company_plans_and_agency',
    OTHER_INSURANCE_LIST: 'other_insurance_list',
    DELETE_OTHER_INSURANCE: 'delete_other_insurance',
    BULK_DELETE_OTHER_INSURANCE: 'bulk_delete_other_insurance',
    VIEW_OTHER_INSURANCE: 'view_other_insurance',
    AI_READ_POLICY: 'ai_read_policy',
  },
  DASHBOARD: {
    DASHBOARD_SUMMARY: 'dashboard_summary',
    DASHBOARD_CALENDAR_EVENTS: 'dashboard_calendar_events',
    DASHBOARD_DAY_DETAILS: 'dashboard_day_details',
    DASHBOARD_PAYMENT_PENDING: 'dashboard_payment_pending',
    DASHBOARD_RENEWAL_TYPE_LIST: 'dashboard_renewal_type_list',
    DASHBOARD_RENEWAL_PENDING: 'dashboard_renewal_pending',
    DASHBOARD_CHART_COMPANY: 'dashboard_chart_company',
    DASHBOARD_CHART_TYPE: 'dashboard_chart_type',
    DASHBOARD_CHART_POLICY: 'dashboard_chart_policy',
  },
  AI_CREDIT: {
    AI_CREDIT_INFO: 'ai_credit_info',
    AI_CREDIT_QUOTE: 'ai_credit_quote',
    AI_CREDIT_PURCHASE: 'ai_credit_purchase',
    AI_CREDIT_HISTORY: 'ai_credit_history',
  },
  SETTINGS: {
    APP_SETTINGS: 'app_settings',
  },
  SEARCH: {
    GLOBAL_SEARCH: 'global_search',
  },
  PRICING: {
    DIRECT_PLAN_INFO: 'direct_plan_info',
    DIRECT_PLAN_QUOTE: 'direct_plan_quote',
    DIRECT_VERIFY_OTP: 'direct_verify_otp',
    DIRECT_PLAN_PURCHASE: 'direct_plan_purchase',
    GST_VERIFY: 'gst_verify',
    POLICY_PLAN_INFO: 'policy_plan_info',
    POLICY_PLAN_QUOTE: 'policy_plan_quote',
    POLICY_PLAN_PURCHASE: 'policy_plan_purchase',
    POLICY_ADDON_PURCHASE: 'policy_addon_purchase',
    POLICY_ADDON_HISTORY: 'policy_addon_history',
  },
};

export default endPointApi;
