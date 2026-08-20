import Link from 'next/link';
import { Shield, ArrowRight, Activity, Phone, Edit2, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Redux
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { resetOtpState } from '@/redux/slices/authSlice';

// React Query Hooks
import { useSendLoginOtp, useVerifyLoginOtp } from '@/hooks/useAuthOtp';


// Components
import OtpBoxInput from '@/components/OtpBoxInput';

export default function LoginPage() {
  const dispatch = useAppDispatch();

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
        { number: values.number },
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
        { number: activeNumber, otp: values.otp },
        {
          onSuccess: (res) => {
            if (res?.message) {
              toast.success(res.message);
            }
            window.location.href = '/';
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
        { number: activeNumber },
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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] p-4 md:p-8 font-sans overflow-hidden relative">
      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#2E3192]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#2BBF8C]/10 blur-[100px] pointer-events-none"></div>

      <div className="flex w-full max-w-[1200px] min-h-[700px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(46,49,146,0.15)] relative z-10 border border-gray-100">

        {/* Left Section - Hero/Brand */}
        <div className="hidden lg:flex flex-col w-[45%] bg-[#2E3192] p-12 relative overflow-hidden text-white justify-between">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2BBF8C]/40 to-transparent rounded-full blur-[80px] -translate-y-1/3 translate-x-1/4"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <img src="/white_logo.png" alt="Insuraa Logo" className="h-10" />
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl leading-[1.15] font-extrabold tracking-tight">
                Secure your future with <span className="text-[#2BBF8C]">Insuraa</span>
              </h1>
              <p className="text-blue-100/80 text-lg max-w-md leading-relaxed">
                The most advanced and intuitive insurance management platform built for modern agencies.
              </p>
            </div>
          </div>

          <div className="relative z-10 grid gap-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-[#2BBF8C]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Bank-grade Security</h3>
                <p className="text-blue-100/70 text-xs mt-0.5">Your data is encrypted and completely secure.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 transition-transform hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-[#2BBF8C]" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Real-time Analytics</h3>
                <p className="text-blue-100/70 text-xs mt-0.5">Track your agency's performance instantly.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - OTP Login Form */}
        <div className="flex flex-col w-full lg:w-[55%] p-8 sm:p-12 md:p-16 justify-center bg-white">
          <div className="w-full max-w-[420px] mx-auto">

            {/* Mobile Logo */}
            <div className="lg:hidden mb-8">
              <img src="/logo.png" alt="Insuraa Logo" className="h-10" />
            </div>

            {!isOtpSent ? (
              /* STEP 1: SEND OTP FORM */
              <div>
                <div className="mb-20">
                  <h2 className="text-2xl font-bold text-[#111827] mb-1.5 tracking-tight text-center">Login via Mobile OTP</h2>
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
  );
}
