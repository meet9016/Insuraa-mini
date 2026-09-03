import Joi from 'joi';

// Life Insurance Form Joi Validation Schema
export const lifeInsuranceSchema = Joi.object({
  customer_id: Joi.string().required().messages({
    'string.empty': 'Please select Customer Name',
  }),

  companies_id: Joi.string().required().messages({
    'string.empty': 'Please select Insurance Company',
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

  sum_assured: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Sum Assured',
  }),

  net_premium: Joi.string().trim().required().messages({
    'string.empty': 'Please enter Net Premium',
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
    'string.empty': 'Customer Name is required',
  }),

  companies_id: Joi.string().required().messages({
    'string.empty': 'Insurance Company is required',
  }),

  plan_name: Joi.string().required().messages({
    'string.empty': 'Plan Name is required',
  }),

  insurance_type: Joi.string().required().messages({
    'string.empty': 'Insurance Type is required',
  }),

  payment_mode: Joi.string().required().messages({
    'string.empty': 'Payment Mode is required',
  }),

  policy_number: Joi.string().trim().required().messages({
    'string.empty': 'Policy Number is required',
  }),

  policy_login_date: Joi.string().required().messages({
    'string.empty': 'Policy Login Date is required',
  }),

  policy_start_date: Joi.string().required().messages({
    'string.empty': 'Policy Start Date is required',
  }),

  policy_end_date: Joi.string().required().messages({
    'string.empty': 'Policy End Date is required',
  }),

  plan_type: Joi.string().required().messages({
    'string.empty': 'Plan Type is required',
  }),

  sum_assured: Joi.string().trim().required().messages({
    'string.empty': 'Sum Assured is required',
  }),

  net_premium: Joi.string().trim().required().messages({
    'string.empty': 'Net Premium is required',
  }),

  total_premium: Joi.string().trim().required().messages({
    'string.empty': 'Total Premium is required',
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
