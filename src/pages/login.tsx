import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight, Zap, Activity, Users } from 'lucide-react';
import { baseUrl, setAuthToken } from '../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Formik validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required'),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data: result } = await axios.post(`${baseUrl.userLogin}`, {
          email: values.email,
          password: values.password,
        });

        if (result.status === 'Success') {
          setAuthToken(result.token);
          toast.success(result.message || 'Login successful');
          window.location.href = '/';
        } else {
          toast.error(result.message || 'Login failed');
        }
      } catch (error: any) {
        console.error(error);
        toast.error(
          error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'
        );
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7FE] p-4 md:p-8 font-sans overflow-hidden relative">

      {/* Background Decorators */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#2E3192]/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-[#2BBF8C]/10 blur-[100px] pointer-events-none"></div>

      <div className="flex w-full max-w-[1200px] min-h-[700px] bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(46,49,146,0.15)] relative z-10 border border-gray-100">

        {/* Left Section - Hero/Brand */}
        <div className="hidden lg:flex flex-col w-[45%] bg-[#2E3192] p-12 relative overflow-hidden text-white justify-between">
          {/* Internal Gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#2BBF8C]/40 to-transparent rounded-full blur-[80px] -translate-y-1/3 translate-x-1/4"></div>

          <div className="relative z-10">
            {/* Logo area */}
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

        {/* Right Section - Login Form */}
        <div className="flex flex-col w-full lg:w-[55%] p-8 sm:p-12 md:p-16 justify-center bg-white">
          <div className="w-full max-w-[420px] mx-auto">

            {/* Mobile Logo */}
            <div className="lg:hidden mb-10">
              <img src="/logo.png" alt="Insuraa Logo" className="h-10" />
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-[#111827] mb-2 tracking-tight">Welcome back</h2>
              <p className="text-gray-500 text-sm">
                Enter your credentials to access your dashboard.
              </p>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-5">

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-[13px] font-semibold text-gray-700 ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-[#2E3192]">
                    <Mail className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-[#2E3192] transition-colors" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white
                      ${formik.touched.email && formik.errors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-[#2D3591] focus:ring-4 focus:ring-[#2D3591]/10'
                      }`}
                    placeholder="Enter your email"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="text-[12px] text-red-500 ml-1 mt-1 font-medium">{formik.errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[13px] font-semibold text-gray-700">Password</label>
                  <Link href="#" className="text-[12px] font-semibold text-[#2E3192] hover:text-[#2BBF8C] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Lock className="h-[18px] w-[18px] text-gray-400 group-focus-within:text-[#2E3192] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter your password"
                    className={`w-full rounded-2xl border py-3.5 pl-12 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all bg-gray-50/50 hover:bg-gray-50 focus:bg-white
                      ${formik.touched.password && formik.errors.password
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-[#2D3591] focus:ring-4 focus:ring-[#2D3591]/10'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-[12px] text-red-500 ml-1 mt-1 font-medium">{formik.errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full relative flex items-center justify-center gap-2 rounded-2xl bg-[#2E3192] py-4 text-[14px] font-bold text-white transition-all hover:bg-[#232569] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-8 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                {loading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <div className="w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 relative z-10">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-[13px] text-gray-600">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-[#2E3192] hover:text-[#2BBF8C] transition-colors">
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
