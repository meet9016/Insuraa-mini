import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, User, Mail, Phone, Building2, MapPin, Globe, Compass, Edit2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// React Query Hooks
import { useSendSignUpOtp, useVerifySignUpOtp } from '@/hooks/useAuthOtp';

// Components
import OtpBoxInput from '@/components/OtpBoxInput';

export default function RegisterPage() {
  const router = useRouter();

  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/login1.webp',
    '/images/login.png', 
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Auto change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  // State for 2-Step Signup Flow:
  // Step 1: Mobile Number Input -> send_sign_up_otp
  // Step 2: OTP + Complete Form Details -> verify_sign_up_otp
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');

  // React Query Mutations
  const sendSignUpOtpMutation = useSendSignUpOtp();
  const verifySignUpOtpMutation = useVerifySignUpOtp();

  // Formik for Step 1: Send Mobile OTP
  const sendOtpFormik = useFormik({
    initialValues: {
      number: '',
    },
    validationSchema: Yup.object({
      number: Yup.string()
        .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit mobile number')
        .required('Mobile number is required'),
    }),
    onSubmit: (values) => {
      sendSignUpOtpMutation.mutate(
        { number: values.number },
        {
          onSuccess: (res) => {
            const isError =
              !res ||
              res.status === false ||
              res.status === 'Failed' ||
              (typeof res.status === 'number' && res.status >= 400);

            if (isError) {
              toast.error(res?.message || 'Failed to send OTP');
              return;
            }

            if (res?.message) {
              toast.success(res.message);
            }
            setMobileNumber(values.number);
            setIsOtpSent(true);
          },
          onError: (err: any) => {
            if (err?.response?.data?.message || err?.message) {
              toast.error(err?.response?.data?.message || err?.message);
            }
          },
        }
      );
    },
  });

  // Formik for Step 2: Complete Registration (OTP + Full Details)
  const verifyDetailsFormik = useFormik({
    initialValues: {
      otp: '',
      full_name: '',
      email: '',
      company_name: '',
      pincode: '',
      country: 'India',
      state: 'Gujrat',
      city: 'Surat',
      address: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^[0-9]{4,6}$/, 'OTP must be 4 to 6 digits')
        .required('OTP is required'),
      full_name: Yup.string().required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      company_name: Yup.string().required('Company Name is required'),
      pincode: Yup.string().required('Pincode is required'),
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      city: Yup.string().required('City is required'),
      address: Yup.string().required('Address is required'),
    }),
    onSubmit: (values) => {
      const activeNumber = mobileNumber || sendOtpFormik.values.number;
      if (!activeNumber) {
        toast.error('Mobile number is missing. Please try again.');
        return;
      }

      const payload = {
        number: activeNumber,
        otp: values.otp,
        full_name: values.full_name,
        email: values.email,
        company_name: values.company_name,
        pincode: values.pincode,
        country: values.country,
        state: values.state,
        city: values.city,
        address: values.address,
      };

      verifySignUpOtpMutation.mutate(payload, {
        onSuccess: (res) => {
          if (res?.message) {
            toast.success(res.message);
          }
          // Redirect to Dashboard after successful registration
          setTimeout(() => {
            router.push('/');
          }, 300);
        },
        onError: (err: any) => {
          if (err?.response?.data?.message || err?.message) {
            toast.error(err?.response?.data?.message || err?.message);
          }
        },
      });
    },
  });

  const handleResendOtp = () => {
    const activeNumber = mobileNumber || sendOtpFormik.values.number;
    if (activeNumber) {
      sendSignUpOtpMutation.mutate(
        { number: activeNumber },
        {
          onSuccess: (res) => {
            const isError =
              !res ||
              res.status === false ||
              res.status === 'Failed' ||
              (typeof res.status === 'number' && res.status >= 400);

            if (isError) {
              toast.error(res?.message || 'Failed to resend OTP');
              return;
            }

            if (res?.message) {
              toast.info(res.message);
            }
          },
          onError: (err: any) => {
            if (err?.response?.data?.message || err?.message) {
              toast.error(err?.response?.data?.message || err?.message);
            }
          },
        }
      );
    }
  };

  // Helper function to check validation errors
  const hasError = (formikObj: any, fieldName: string) => {
    return Boolean(
      (formikObj.touched[fieldName] || formikObj.submitCount > 0) && formikObj.errors[fieldName]
    );
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-white">
      <style>{`
        .hide-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Left Side Form Container */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-4 md:p-8 relative bg-[#F4F7FE] overflow-y-auto overflow-x-hidden h-screen hide-scroll" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Background Decorators */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#2BBF8C]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#2E3192]/10 blur-[100px] pointer-events-none"></div>

        <div className={`flex w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(46,49,146,0.15)] relative z-10 border border-gray-100 transition-all duration-500 ease-in-out my-auto ${isOtpSent ? 'max-w-[800px]' : 'max-w-[500px]'}`}>
        
        {/* Register Form / OTP */}
        <div className="flex flex-col w-full p-6 sm:p-10 justify-center bg-white">
          <div className={`w-full mx-auto transition-all duration-500 ease-in-out ${isOtpSent ? 'max-w-[680px]' : 'max-w-[440px]'}`}>

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="Insuraa Logo" className="h-12" />
            </div>

            {!isOtpSent ? (
              /* STEP 1: MOBILE NUMBER ENTRY -> send_sign_up_otp */
              <div>
                <div className="mb-20">
                  <h2 className="text-3xl font-bold text-[#111827] mb-1.5 tracking-tight text-center">Create an Account</h2>
                  <p className="text-gray-500 text-xs text-center">
                    Enter your mobile number to receive a Sign Up verification OTP.
                  </p>
                </div>

                <form onSubmit={sendOtpFormik.handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-gray-700 ml-1">
                      Mobile Number <span className="text-red-500 font-bold">*</span>
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <Phone className={`h-[18px] w-[18px] transition-colors ${hasError(sendOtpFormik, 'number') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                      </div>
                      <input
                        type="text"
                        name="number"
                        maxLength={10}
                        value={sendOtpFormik.values.number}
                        onChange={sendOtpFormik.handleChange}
                        onBlur={sendOtpFormik.handleBlur}
                        placeholder="Enter 10-digit mobile number"
                        className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm outline-none transition-all ${hasError(sendOtpFormik, 'number')
                          ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-4 focus:ring-red-500/20'
                          : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2D3591] focus:ring-4 focus:ring-[#2D3591]/10'
                          }`}
                      />
                    </div>
                    {hasError(sendOtpFormik, 'number') && (
                      <p className="text-[12px] text-red-500 ml-1 mt-1 font-medium">{sendOtpFormik.errors.number}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={sendSignUpOtpMutation.isPending}
                    className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-[#2E3192] py-4 text-[14px] font-bold text-white transition-all hover:bg-[#232569] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6 group overflow-hidden"
                  >
                    {sendSignUpOtpMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Send OTP</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              /* STEP 2: OTP + FULL REGISTRATION DETAILS -> verify_sign_up_otp */
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#111827] mb-7 tracking-tight text-center">Complete Your Details</h2>
                  <div className="flex items-center gap-2 mt-1 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
                    <span className="text-sm text-gray-600 "> <strong className="text-gray-900 font-bold">{mobileNumber}</strong></span>
                    <button
                      type="button"
                      onClick={() => setIsOtpSent(false)}
                      className="ml-auto text-xs text-[#2E3192] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Edit2 className="w-3 h-3" /> Edit Number
                    </button>
                  </div>
                </div>

                <form onSubmit={verifyDetailsFormik.handleSubmit} className="space-y-4">

                  {/* OTP Digit Boxes */}
                  <div className="space-y-2 bg-gray-50/70 p-3 rounded-2xl border border-gray-100">
                    <div className="flex items-center justify-between px-1">
                      <label className="text-[12px] font-semibold text-gray-700">
                        Enter 4-Digit Verification Code <span className="text-red-500 font-bold">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={sendSignUpOtpMutation.isPending}
                        className="text-xs font-semibold text-[#2E3192] hover:underline flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${sendSignUpOtpMutation.isPending ? 'animate-spin' : ''}`} />
                        Resend OTP
                      </button>
                    </div>
                    <OtpBoxInput
                      length={4}
                      value={verifyDetailsFormik.values.otp}
                      onChange={(val) => verifyDetailsFormik.setFieldValue('otp', val)}
                      error={hasError(verifyDetailsFormik, 'otp')}
                    />
                    {hasError(verifyDetailsFormik, 'otp') && (
                      <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.otp}</p>
                    )}
                  </div>

                  {/* Additional Form Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        Full Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <User className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'full_name') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="full_name"
                          value={verifyDetailsFormik.values.full_name}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="Full Name"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'full_name')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'full_name') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.full_name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        Email Address <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Mail className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'email') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={verifyDetailsFormik.values.email}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="Email Address"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'email')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'email') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.email}</p>
                      )}
                    </div>

                    {/* Company Name */}
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        Company Name <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Building2 className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'company_name') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="company_name"
                          value={verifyDetailsFormik.values.company_name}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="Company Name"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'company_name')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'company_name') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.company_name}</p>
                      )}
                    </div>

                    {/* Pincode */}
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        Pincode <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <MapPin className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'pincode') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="pincode"
                          maxLength={6}
                          value={verifyDetailsFormik.values.pincode}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="Pincode"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'pincode')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'pincode') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.pincode}</p>
                      )}
                    </div>

                    {/* City */}
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        City <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Compass className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'city') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="city"
                          value={verifyDetailsFormik.values.city}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="City"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'city')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'city') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div className="space-y-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        State <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Compass className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'state') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="state"
                          value={verifyDetailsFormik.values.state}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="State"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'state')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'state') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.state}</p>
                      )}
                    </div>

                    {/* Country */}
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        Country <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <Globe className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'country') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="country"
                          value={verifyDetailsFormik.values.country}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="Country"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'country')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'country') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.country}</p>
                      )}
                    </div>

                    {/* Address - Full Width */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[12px] font-semibold text-gray-700 ml-1">
                        Address <span className="text-red-500 font-bold">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                          <MapPin className={`h-4 w-4 ${hasError(verifyDetailsFormik, 'address') ? 'text-red-500' : 'text-gray-400 group-focus-within:text-[#2E3192]'}`} />
                        </div>
                        <input
                          type="text"
                          name="address"
                          value={verifyDetailsFormik.values.address}
                          onChange={verifyDetailsFormik.handleChange}
                          onBlur={verifyDetailsFormik.handleBlur}
                          placeholder="Complete Address"
                          className={`w-full rounded-xl border py-2.5 pl-10 pr-3 text-sm outline-none transition-all ${hasError(verifyDetailsFormik, 'address')
                            ? '!border-red-500 text-red-900 bg-red-50/30 focus:!border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-gray-200 text-gray-900 bg-gray-50/50 hover:bg-gray-50 focus:bg-white focus:border-[#2E3192] focus:ring-2 focus:ring-[#2E3192]/10'
                            }`}
                        />
                      </div>
                      {hasError(verifyDetailsFormik, 'address') && (
                        <p className="text-[11px] text-red-500 ml-1 font-medium">{verifyDetailsFormik.errors.address}</p>
                      )}
                    </div>

                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={verifySignUpOtpMutation.isPending}
                    className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-[#2E3192] py-4 text-[14px] font-bold text-white transition-all hover:bg-[#232569] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-5 group overflow-hidden"
                  >
                    {verifySignUpOtpMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying & Registering...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Verify & Complete Registration</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-[13px] text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-bold text-[#2E3192] hover:text-[#2BBF8C] transition-colors">
                  Sign In
                </Link>
              </p>
            </div>

          </div>
          </div>
        </div>
      </div>

      {/* Right Side Image Banner */}
      <div className="hidden lg:flex lg:w-[70%] relative items-center justify-center bg-white overflow-hidden">
        {images.map((img, index) => (
          <img 
            key={index}
            src={img} 
            alt={`Insurance CRM Software ${index + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out transform ${
              index === currentImageIndex 
                ? 'opacity-100 translate-y-0 z-10' 
                : 'opacity-0 translate-y-12 z-0'
            }`} 
          />
        ))}
        {/* Slider Indicator Dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-2.5 rounded-full transition-all shadow-sm duration-500 ease-in-out ${
                index === currentImageIndex 
                  ? 'bg-[#2E3192] w-8' 
                  : 'bg-gray-300 w-2.5 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
