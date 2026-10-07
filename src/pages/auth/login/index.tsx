import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Shield, ArrowRight, Activity, Phone, Edit2, RefreshCw, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Redux
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetOtpState, setUser, User as ReduxUser } from '@/redux/slices/authSlice';

// React Query Hooks
import { useSendLoginOtp, useVerifyLoginOtp } from '@/hooks/useAuthOtp';


// Components
import OtpBoxInput from '@/components/OtpBoxInput';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    '/images/login1.webp',
    '/images/login.png', // Placeholder for 2nd image
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 6000); // Auto change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  // Login Role Selection State ('admin' | 'staff')
  const [loginType, setLoginType] = useState<'admin' | 'staff'>('admin');

  // Redux state
  const { otpPhoneNumber, isOtpSent } = useAppSelector((state) => state.auth);

  // React Query Mutations
  const sendOtpMutation = useSendLoginOtp();
  const verifyOtpMutation = useVerifyLoginOtp();

  // Formik for Mobile Number Step (Step 1)
  const sendOtpFormik = useFormik({
    initialValues: {
      number: otpPhoneNumber || '',
    },
    validationSchema: Yup.object({
      number: Yup.string()
        .matches(/^[0-9]{10}$/, 'Must be a valid 10-digit mobile number')
        .required('Mobile number is required'),
    }),
    onSubmit: (values) => {
      sendOtpMutation.mutate(
        { number: values.number, login_type: loginType },
        {
          onSuccess: (res) => {
            const isError =
              !res ||
              res.status === 400 ||
              res.status === 401 ||
              res.status === false;

            if (isError) {
              toast.error(res?.message || 'Number not registered');
              return;
            }

            if (res?.message) {
              toast.success(res.message);
            }
          },
          onError: (err: any) => {
            if (err?.response?.data?.message || err?.message) {
              toast.error(err?.response?.data?.message || err?.message);
            } else {
              toast.error('Number not registered');
            }
          },
        }
      );
    },
  });

  // Formik for OTP Verification Step (Step 2)
  const verifyOtpFormik = useFormik({
    initialValues: {
      otp: '',
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .matches(/^[0-9]{4,6}$/, 'OTP must be 4 to 6 digits')
        .required('OTP is required'),
    }),
    onSubmit: (values) => {
      if (!otpPhoneNumber && !sendOtpFormik.values.number) {
        toast.error('Mobile number missing. Please request OTP again.');
        return;
      }
      const activeNumber = otpPhoneNumber || sendOtpFormik.values.number;

      verifyOtpMutation.mutate(
        { number: activeNumber, otp: values.otp, login_type: loginType },
        {
          onSuccess: (res) => {
            if (res?.message) {
              toast.success(res.message);
            }
            const resolvedLoginType =
              res?.data?.login_type ||
              res?.login_type ||
              loginType;

            if (typeof window !== 'undefined' && resolvedLoginType) {
              localStorage.setItem('login_type', resolvedLoginType);
              localStorage.setItem('auth_login_type', resolvedLoginType);
            }

            const rawUser = res?.data?.user || res?.user;
            if (rawUser) {
              const userPayload: ReduxUser = {
                id: rawUser.id ? String(rawUser.id) : undefined,
                full_name: rawUser.full_name || '',
                name: rawUser.full_name || rawUser.name || rawUser.username || '',
                email: rawUser.email || '',
                number: rawUser.number || '',
                company_name: rawUser.company_name || '',
                user_role_id: rawUser.user_role_id ? String(rawUser.user_role_id) : undefined,
                role: rawUser.user_role_id ? String(rawUser.user_role_id) : undefined,
                username: rawUser.username || '',
                login_type: resolvedLoginType,
              };
              dispatch(setUser(userPayload));
            }
            if (typeof window !== 'undefined') {
              sessionStorage.setItem('insuraa_just_logged_in', 'true');
              sessionStorage.removeItem('insuraa_subscription_shown');
            }
            router.push('/');
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

  const handleEditPhoneNumber = () => {
    dispatch(resetOtpState());
  };

  const handleResendOtp = () => {
    const activeNumber = otpPhoneNumber || sendOtpFormik.values.number;
    if (activeNumber) {
      sendOtpMutation.mutate(
        { number: activeNumber, login_type: loginType },
        {
          onSuccess: (res) => {
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
      {/* Left Side Image Banner */}
      <div className="hidden lg:flex lg:w-[70%] relative items-center justify-center bg-white overflow-hidden">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Insurance CRM Software ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out transform ${index === currentImageIndex
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
              className={`h-2.5 rounded-full transition-all shadow-sm duration-500 ease-in-out ${index === currentImageIndex
                  ? 'bg-[#2E3192] w-8'
                  : 'bg-gray-300 w-2.5 hover:bg-gray-400'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side Form Container */}
      <div className="w-full lg:w-[30%] flex items-center justify-center p-4 md:p-8 relative bg-[#F4F7FE]">
        {/* Background Decorators */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#2E3192]/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#2BBF8C]/10 blur-[100px] pointer-events-none"></div>

        <div className="flex w-full max-w-[500px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(46,49,146,0.15)] relative z-10 border border-gray-100">

          {/* OTP Login Form */}
          <div className="flex flex-col w-full p-8 sm:p-12 justify-center bg-white">
            <div className="w-full max-w-[420px] mx-auto">

              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img src="/logo.png" alt="Insuraa Logo" className="h-12" />
              </div>

              {/* Simple Small Width Buttons for Admin & Staff Role Selection */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setLoginType('admin')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border min-w-[110px] ${loginType === 'admin'
                    ? 'bg-[#2E3192] text-white border-[#2E3192] shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType('staff')}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border min-w-[110px] ${loginType === 'staff'
                    ? 'bg-[#2E3192] text-white border-[#2E3192] shadow-md'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Staff</span>
                </button>
              </div>

              {!isOtpSent ? (
                /* STEP 1: SEND OTP FORM */
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-[#111827] mb-1.5 tracking-tight text-center">
                      Login as <span className="text-[#2E3192] capitalize">{loginType}</span>
                    </h2>
                    <p className="text-gray-500 text-xs text-center">
                      Enter your mobile number to receive a verification code.
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
                      disabled={sendOtpMutation.isPending}
                      className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-[#2E3192] py-4 text-[14px] font-bold text-white transition-all hover:bg-[#232569] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-6 group overflow-hidden"
                    >
                      {sendOtpMutation.isPending ? (
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
                /* STEP 2: VERIFY OTP FORM */
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[#111827] mb-10 tracking-tight text-center">Verify OTP</h2>
                    <div className="flex items-center gap-2 mt-1 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
                      <span className="text-sm text-gray-600"><strong className="text-gray-900 font-bold">{otpPhoneNumber || sendOtpFormik.values.number}</strong></span>
                      <button
                        type="button"
                        onClick={handleEditPhoneNumber}
                        className="ml-auto text-xs text-[#2E3192] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3 h-3" /> Edit Number
                      </button>
                    </div>
                  </div>

                  <form onSubmit={verifyOtpFormik.handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[13px] font-semibold text-gray-700 ml-1">
                        Enter 4-Digit OTP Code <span className="text-red-500 font-bold">*</span>
                      </label>
                      <OtpBoxInput
                        length={4}
                        value={verifyOtpFormik.values.otp}
                        onChange={(val) => verifyOtpFormik.setFieldValue('otp', val)}
                        error={hasError(verifyOtpFormik, 'otp')}
                      />
                      {hasError(verifyOtpFormik, 'otp') && (
                        <p className="text-[12px] text-red-500 ml-1 font-medium">{verifyOtpFormik.errors.otp}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs px-1">
                      <span className="text-gray-500">Didn't receive code?</span>
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={sendOtpMutation.isPending}
                        className="font-bold text-[#2E3192] hover:text-[#2BBF8C] transition-colors flex items-center gap-1 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${sendOtpMutation.isPending ? 'animate-spin' : ''}`} />
                        Resend OTP
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={verifyOtpMutation.isPending}
                      className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-[#2E3192] py-4 text-[14px] font-bold text-white transition-all hover:bg-[#232569] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 group overflow-hidden"
                    >
                      {verifyOtpMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                          <span>Verifying OTP...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Verify & Login</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              )}

              <div className="mt-8 text-center">
                <p className="text-[13px] text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="font-bold text-[#2E3192] hover:text-[#2BBF8C] transition-colors">
                    Create an account
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
