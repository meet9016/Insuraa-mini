import Joi from 'joi';

// Life Insurance Form Joi Validation Schema
export const lifeInsuranceSchema = Joi.object({
  customer_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Name',
  }),

  companies_id: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Company Name',
  }),

  payment_mode: Joi.string().required().messages({
    'string.empty': 'Please select Payment Mode',
  }),

  policy_number: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Policy Number',
  }),

  policy_premium_term: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Policy Premium Term',
  }),

  policy_term: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Policy Term',
  }),

  policy_login_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Login Date',
  }),

  policy_start_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Start Date',
  }),

  policy_end_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Premium End Date',
  }),

  policy_maturity_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Maturity Date',
  }),

  plan_type: Joi.string().required().messages({
    'string.empty': 'Please select Plan Type',
  }),

  sum_assured: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Sum Assured',
      'string.pattern.base': 'Please enter a valid Sum Assured',
    }),

  net_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Net Premium',
      'string.pattern.base': 'Please enter a valid Net Premium',
    }),

  maturity_amount: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  gst_amount: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  ifsc_code: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/i)
    .messages({
      'string.pattern.base': 'Please enter a valid IFSC code (e.g. SBIN0001234)',
    }),
});

// Helper function to validate Life Insurance form data using Joi
export const validateLifeInsurance = (formData: any, nominees: any[] = []) => {
  const errors: Record<string, string> = {};

  const { error } = lifeInsuranceSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  // Validate nominees
  if (nominees && nominees.some((n: any) => !n.nomainee_name || !n.nomainee_name.trim())) {
    errors.nomainee_name = 'Please enter Nominee Name';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Health Insurance Form Joi Validation Schema
export const healthInsuranceSchema = Joi.object({
  customer_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Name',
  }),

  companies_id: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Company Name',
  }),

  plan_name: Joi.string().required().messages({
    'string.empty': 'Please select Plan Name',
  }),

  insurance_type: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Type',
  }),

  payment_mode: Joi.string().required().messages({
    'string.empty': 'Please select Payment Mode',
  }),

  policy_number: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Policy Number',
  }),

  policy_login_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Login Date',
  }),

  policy_start_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Start Date',
  }),

  policy_end_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy End Date',
  }),

  plan_type: Joi.string().required().messages({
    'string.empty': 'Please select Plan Type',
  }),

  sum_assured: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Sum Assured',
      'string.pattern.base': 'Please enter a valid Sum Assured',
    }),

  net_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Net Premium',
      'string.pattern.base': 'Please enter a valid Net Premium',
    }),

  total_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Total Premium',
      'string.pattern.base': 'Please enter a valid Total Premium',
    }),

  bonus: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  health_check_up_amount: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  deductable: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  claim: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  gst_amount: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),
});

// Helper function to validate Health Insurance form data using Joi
export const validateHealthInsurance = (formData: any) => {
  const errors: Record<string, string> = {};

  const { error } = healthInsuranceSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Customer Form Joi Validation Schema
export const customerSchema = Joi.object({
  customerType: Joi.string().required().messages({
    'string.empty': 'Customer Type is required',
  }),

  firstName: Joi.string().trim().required().messages({
    'string.empty': 'First Name is required',
  }),

  lastName: Joi.string().trim().required().messages({
    'string.empty': 'Last Name is required',
  }),

  customerNumber: Joi.string()
    .trim()
    .required()
    .pattern(/^\d{10}$/)
    .messages({
      'string.empty': 'Phone Number is required',
      'string.pattern.base': 'Please enter a valid 10-digit phone number',
    }),

  pincode: Joi.string().trim().required().messages({
    'string.empty': 'Pincode is required',
  }),
});

// Helper function to validate Customer form data using Joi
export const validateCustomer = (formData: any) => {
  const errors: Record<string, string> = {};

  const { error } = customerSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Company Form Joi Validation Schema
export const companySchema = Joi.object({
  companyName: Joi.string().trim().required().messages({
    'string.empty': 'Company Name is required',
  }),
});

// Helper function to validate Company Name using Joi
export const validateCompany = (companyName: string) => {
  const { error } = companySchema.validate({ companyName }, { abortEarly: false });
  if (error) {
    return error.details[0]?.message || 'Company Name is required';
  }
  return '';
};

// Company Plan Form Joi Validation Schema
export const companyPlanSchema = Joi.object({
  planName: Joi.string().trim().required().messages({
    'string.empty': 'Plan Name is required',
  }),
});

// Helper function to validate Plan Name using Joi
export const validateCompanyPlan = (planName: string) => {
  const { error } = companyPlanSchema.validate({ planName }, { abortEarly: false });
  if (error) {
    return error.details[0]?.message || 'Plan Name is required';
  }
  return '';
};

// Agency Code Form Joi Validation Schema
export const agencyCodeSchema = Joi.object({
  company_id: Joi.string().required().messages({
    'string.empty': 'Company is required',
  }),

  name: Joi.string().trim().required().messages({
    'string.empty': 'Name is required',
  }),

  code: Joi.string().trim().required().messages({
    'string.empty': 'Agency Code is required',
  }),

  mobile_number: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d{10}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
    }),

  email: Joi.string()
    .trim()
    .allow('', null)
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Please enter a valid email address',
    }),
});

// Helper function to validate Agency Code form data using Joi
export const validateAgencyCode = (formData: any) => {
  const errors: Record<string, string> = {};

  const { error } = agencyCodeSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Rider Form Joi Validation Schema
export const riderSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Rider Name is required',
  }),
});

// Helper function to validate Rider Name using Joi
export const validateRider = (name: string) => {
  const { error } = riderSchema.validate({ name }, { abortEarly: false });
  if (error) {
    return error.details[0]?.message || 'Rider Name is required';
  }
  return '';
};

// Source of Lead Form Joi Validation Schema
export const sourceOfLeadSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Source of Lead Name is required',
  }),
});

// Helper function to validate Source of Lead Name using Joi
export const validateSourceOfLead = (name: string) => {
  const { error } = sourceOfLeadSchema.validate({ name }, { abortEarly: false });
  if (error) {
    return error.details[0]?.message || 'Source of Lead Name is required';
  }
  return '';
};

// Document Master Form Joi Validation Schema
export const documentMasterSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    'string.empty': 'Document Name is required',
  }),
});

// Helper function to validate Document Name using Joi
export const validateDocumentMaster = (name: string) => {
  const { error } = documentMasterSchema.validate({ name }, { abortEarly: false });
  if (error) {
    return error.details[0]?.message || 'Document Name is required';
  }
  return '';
};

// Motor Insurance Form Joi Validation Schema
export const motorInsuranceSchema = Joi.object({
  customer_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Name',
  }),

  companies_id: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Company Name',
  }),

  plan_name: Joi.string().required().messages({
    'string.empty': 'Please select Plan Name',
  }),

  plan_type: Joi.string().required().messages({
    'string.empty': 'Please select Plan Type',
  }),

  vehicle_type: Joi.string().required().messages({
    'string.empty': 'Please select Vehicle Type',
  }),

  class_of_vehicle: Joi.string().required().messages({
    'string.empty': 'Please select Class Of Vehicle',
  }),

  insurance_type: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Type',
  }),

  registration_number_rto: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Registration Number/RTO',
  }),

  policy_number: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Policy Number',
  }),

  policy_login_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Login Date',
  }),

  policy_start_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Start Date',
  }),

  policy_end_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy End Date',
  }),

  net_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Net Premium',
      'string.pattern.base': 'Please enter a valid Net Premium',
    }),

  total_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Total Premium',
      'string.pattern.base': 'Please enter a valid Total Premium',
    }),

  cng_value: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  vehicle_value: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  own_damage_premimum: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  tp_premium: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  gst_amount: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),
});

// Helper function to validate Motor Insurance form data using Joi
export const validateMotorInsurance = (formData: any) => {
  const errors: Record<string, string> = {};

  const { error } = motorInsuranceSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Health Quotation Form Joi Validation Schema
export const healthQuotationSchema = Joi.object({
  insured_name: Joi.string().trim().required().messages({
    'string.empty': 'Insured Name is required',
  }),

  mobile: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d{10}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
    }),

  email: Joi.string()
    .trim()
    .allow('', null)
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Please enter a valid email address',
    }),

  house_no: Joi.string().trim().allow('', null),

  pincode: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d{6}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 6-digit pincode',
    }),
});

// Helper function to validate Health Quotation form data, quotes, and members using Joi
export const validateHealthQuotation = (formData: any, quotes: any[] = [], members: any[] = []) => {
  const errors: Record<string, string> = {};
  const quoteErrors: Record<string | number, Record<string, string>> = {};
  const memberErrors: Record<string | number, Record<string, string>> = {};

  const { error } = healthQuotationSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  // Validate Quotes (Company, Product, SA, Premium 1Y, Premium 2Y, Premium 3Y)
  if (quotes && quotes.length > 0) {
    quotes.forEach((q, idx) => {
      const qErr: Record<string, string> = {};
      const qId = q.id !== undefined && q.id !== null ? q.id : idx;

      if (!q.company_name || !String(q.company_name).trim()) {
        qErr.company_name = 'Company is required';
      }

      if (!q.product_name || !String(q.product_name).trim()) {
        qErr.product_name = 'Product is required';
      }

      if (q.sa && String(q.sa).trim() !== '' && !/^\d+(\.\d+)?$/.test(String(q.sa).trim())) {
        qErr.sa = 'Please enter a valid number';
      }

      if (!q.premium_1y || !String(q.premium_1y).trim()) {
        qErr.premium_1y = 'Premium 1Y is required';
      } else if (!/^\d+(\.\d+)?$/.test(String(q.premium_1y).trim())) {
        qErr.premium_1y = 'Please enter a valid number';
      }

      if (q.premium_2y && String(q.premium_2y).trim() !== '' && !/^\d+(\.\d+)?$/.test(String(q.premium_2y).trim())) {
        qErr.premium_2y = 'Please enter a valid number';
      }

      if (q.premium_3y && String(q.premium_3y).trim() !== '' && !/^\d+(\.\d+)?$/.test(String(q.premium_3y).trim())) {
        qErr.premium_3y = 'Please enter a valid number';
      }

      if (Object.keys(qErr).length > 0) {
        quoteErrors[qId] = qErr;
      }
    });
  }

  // Validate Members (Name, Relation, DOB, Age, Gender)
  if (members && members.length > 0) {
    members.forEach((m, idx) => {
      const mErr: Record<string, string> = {};
      const mId = m.id !== undefined && m.id !== null ? m.id : idx;

      if (!m.member_name || !String(m.member_name).trim()) {
        mErr.member_name = 'Name is required';
      }

      if (!m.relation || !String(m.relation).trim()) {
        mErr.relation = 'Relation is required';
      }

      if (!m.dob || !String(m.dob).trim()) {
        mErr.dob = 'DOB is required';
      }

      if (m.age && String(m.age).trim() !== '' && !/^\d{1,3}$/.test(String(m.age).trim())) {
        mErr.age = 'Invalid age';
      }

      if (!m.gender || !String(m.gender).trim()) {
        mErr.gender = 'Gender is required';
      }

      if (Object.keys(mErr).length > 0) {
        memberErrors[mId] = mErr;
      }
    });
  }

  const isValid =
    Object.keys(errors).length === 0 &&
    Object.keys(quoteErrors).length === 0 &&
    Object.keys(memberErrors).length === 0;

  return {
    isValid,
    errors,
    quoteErrors,
    memberErrors,
  };
};

// Motor Quotation Form Joi Validation Schema
export const motorQuotationSchema = Joi.object({
  insured_name: Joi.string().trim().required().messages({
    'string.empty': 'Insured Person Name is required',
  }),

  mobile: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d{10}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 10-digit mobile number',
    }),

  email: Joi.string()
    .trim()
    .allow('', null)
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': 'Please enter a valid email address',
    }),

  pincode: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d{6}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 6-digit pincode',
    }),

  mfg_year: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d{4}$/)
    .messages({
      'string.pattern.base': 'Please enter a valid 4-digit year',
    }),

  seat_capacity: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+$/)
    .messages({
      'string.pattern.base': 'Please enter a valid seating capacity',
    }),

  total_idv: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),

  ncb_percent: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid percentage',
    }),
});

// Helper function to validate Motor Quotation form data and quotes using Joi
export const validateMotorQuotation = (formData: any, quotes: any[] = []) => {
  const errors: Record<string, string> = {};
  const quoteErrors: Record<string | number, Record<string, string>> = {};

  const { error } = motorQuotationSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  // Check vehicle_type (either vehicle_type_id or vehicle_type)
  if (!formData.vehicle_type_id && !formData.vehicle_type) {
    errors.vehicle_type_id = 'Vehicle Type is required';
  }

  // Validate Quotes (Company, Product, Premium, IDV, Discount)
  if (quotes && quotes.length > 0) {
    quotes.forEach((q, idx) => {
      const qErr: Record<string, string> = {};
      const qId = q.id !== undefined && q.id !== null ? q.id : idx;

      if (!q.company_id && !q.company_name) {
        qErr.company_id = 'Company is required';
      }

      if (!q.product_id && !q.product_name) {
        qErr.product_id = 'Product is required';
      }

      if (q.idv && String(q.idv).trim() !== '' && !/^\d+(\.\d+)?$/.test(String(q.idv).trim())) {
        qErr.idv = 'Please enter a valid number';
      }

      if (!q.premium || !String(q.premium).trim()) {
        qErr.premium = 'Premium is required';
      } else if (!/^\d+(\.\d+)?$/.test(String(q.premium).trim())) {
        qErr.premium = 'Please enter a valid number';
      }

      if (q.discount && String(q.discount).trim() !== '' && !/^\d+(\.\d+)?$/.test(String(q.discount).trim())) {
        qErr.discount = 'Please enter a valid number';
      }

      if (Object.keys(qErr).length > 0) {
        quoteErrors[qId] = qErr;
      }
    });
  }

  const isValid = Object.keys(errors).length === 0 && Object.keys(quoteErrors).length === 0;

  return {
    isValid,
    errors,
    quoteErrors,
  };
};

// Claim Form Joi Validation Schema
export const claimSchema = Joi.object({
  customer_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Name',
  }),

  insurance_type: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Type',
  }),

  customer_insurance_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Policy',
  }),

  admited_date: Joi.string().required().messages({
    'string.empty': 'Please select Admitted Date',
  }),

  discharge_date: Joi.string().required().messages({
    'string.empty': 'Please select Discharge Date',
  }),

  calim_amount: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Claim Amount is required',
      'string.pattern.base': 'Please enter a valid Claim Amount',
    }),

  deducted_amount: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Deducted Amount is required',
      'string.pattern.base': 'Please enter a valid Deducted Amount',
    }),

  setteled_amount: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Settled Amount is required',
      'string.pattern.base': 'Please enter a valid Settled Amount',
    }),

  claim_number: Joi.string().trim().required().messages({
    'string.empty': 'Claim Number is required',
  }),

  file_at_office: Joi.string().required().messages({
    'string.empty': 'Please select File At Office Date',
  }),

  file_at_company: Joi.string().required().messages({
    'string.empty': 'Please select File At Company Date',
  }),

  next_followup_date: Joi.string().required().messages({
    'string.empty': 'Please select Next Followup Date',
  }),

  query: Joi.string().required().messages({
    'string.empty': 'Please select Query Date',
  }),

  claim_satteled_date: Joi.string().required().messages({
    'string.empty': 'Please select Claim Settled Date',
  }),

  diagnosis: Joi.string().trim().required().messages({
    'string.empty': 'Diagnosis is required',
  }),

  claim_status: Joi.string().required().messages({
    'string.empty': 'Please select Claim Status',
  }),

  name_of_doctor: Joi.string().trim().required().messages({
    'string.empty': 'Doctor Name is required',
  }),

  name_of_hospital: Joi.string().trim().required().messages({
    'string.empty': 'Hospital Name is required',
  }),

  location_of_hospital: Joi.string().trim().required().messages({
    'string.empty': 'Hospital Location is required',
  }),

  hospital_type: Joi.string().trim().required().messages({
    'string.empty': 'Hospital Type is required',
  }),

  rating_of_hospital: Joi.string().required().messages({
    'string.empty': 'Please select Hospital Rating',
  }),

  note: Joi.string().trim().required().messages({
    'string.empty': 'Note is required',
  }),
});

// Helper function to validate Claim form data using Joi
export const validateClaim = (formData: any) => {
  const errors: Record<string, string> = {};

  const { error } = claimSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Other Insurance Form Joi Validation Schema
export const otherInsuranceSchema = Joi.object({
  customer_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Name',
  }),

  other_insurance_type: Joi.string().required().messages({
    'string.empty': 'Please select Other Insurance Type',
  }),

  companies_id: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Company Name',
  }),

  policy_number: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Policy Number',
  }),

  policy_login_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Login Date',
  }),

  policy_start_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy Start Date',
  }),

  policy_end_date: Joi.string().required().messages({
    'string.empty': 'Please select Policy End Date',
  }),

  sum_assured: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid Sum Assured',
    }),

  net_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Net Premium',
      'string.pattern.base': 'Please enter a valid Net Premium',
    }),

  total_premium: Joi.string()
    .trim()
    .required()
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.empty': 'Please enter Total Premium',
      'string.pattern.base': 'Please enter a valid Total Premium',
    }),

  gst_amount: Joi.string()
    .trim()
    .allow('', null)
    .pattern(/^\d+(\.\d+)?$/)
    .messages({
      'string.pattern.base': 'Please enter a valid amount',
    }),
});

// Helper function to validate Other Insurance form data using Joi
export const validateOtherInsurance = (formData: any) => {
  const errors: Record<string, string> = {};

  const { error } = otherInsuranceSchema.validate(formData, { abortEarly: false, allowUnknown: true });

  if (error) {
    error.details.forEach((detail) => {
      const key = detail.path[0] as string;
      if (key && !errors[key]) {
        errors[key] = detail.message;
      }
    });
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};



