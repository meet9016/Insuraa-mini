import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { User, Mail, MapPin, Building2, Globe2, Flag, Map, CircleUserRound, ShieldCheck, CreditCard, LayoutDashboard, CalendarDays } from 'lucide-react';
import Input from '@/components/ui/Input';
import { useFetchProfile, useUpdateProfile } from '@/hooks/useProfileApi';

export default function ProfilePage() {
  const { data: profileData, isLoading } = useFetchProfile();
  const updateProfileMutation = useUpdateProfile();

  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    email: '',
    address: '',
    pincode: '',
    nationality: 'India',
    state: '',
    city: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || '',
        company_name: profileData.company_name || '',
        email: profileData.email || '',
        address: profileData.address || '',
        pincode: profileData.pincode || '',
        nationality: profileData.nationality || profileData.country || 'India',
        state: profileData.state || '',
        city: profileData.city || '',
      });
    }
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!formData.full_name) newErrors.full_name = 'Full Name is required';
    if (!formData.company_name) newErrors.company_name = 'Company Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await updateProfileMutation.mutateAsync(formData);
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-8 min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2B4399]"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-[#f8fafc] p-6 min-h-[calc(100vh-80px)]">
      <Head>
        <title>My Profile - Insuraa</title>
      </Head>

      <div className="w-full space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">Manage your account details and subscription</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Profile Card & Subscription */}
          <div className="space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-6 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#2B4399] to-[#4F46E5] opacity-10"></div>
              
              <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-white shadow-md flex items-center justify-center text-[#2B4399] mb-4 relative z-10 mt-4">
                <CircleUserRound size={48} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-xl font-bold text-gray-900">{profileData?.full_name || 'Admin User'}</h2>
              <p className="text-sm font-semibold text-[#2B4399] mt-1 bg-blue-50 px-3 py-1 rounded-full">
                {profileData?.company_name || 'Insuraa'}
              </p>

              <div className="w-full mt-6 space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">User Code</span>
                  <span className="font-bold text-gray-800">{profileData?.user_code || '-'}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                  <span className="text-gray-500 font-medium">Login Type</span>
                  <span className="font-bold text-gray-800 capitalize flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    {profileData?.login_type || 'Admin'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Total Staff</span>
                  <span className="font-bold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                    {profileData?.staff_count || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            {profileData?.subscription && (
              <div className="bg-gradient-to-br from-[#2B4399] to-[#1e3278] rounded-2xl shadow-lg border border-blue-800/50 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-20">
                  <CreditCard size={64} />
                </div>
                <div className="relative z-10">
                  <h3 className="text-lg font-black text-white mb-1">Subscription</h3>
                  <p className="text-blue-200 text-xs font-medium mb-5">Your current active plan</p>
                  
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 mb-4">
                    <div className="text-sm text-blue-100 font-medium mb-1">Plan Name</div>
                    <div className="text-xl font-black text-white">{profileData.subscription.plan_name}</div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-200/80 flex items-center gap-1.5"><CalendarDays size={14}/> Starting Date</span>
                      <span className="font-bold">{profileData.subscription.starting_date}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-200/80 flex items-center gap-1.5"><CalendarDays size={14}/> Ending Date</span>
                      <span className="font-bold">{profileData.subscription.ending_date}</span>
                    </div>
                    <div className="pt-2 mt-2 border-t border-white/10">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-200/80">Days Left</span>
                        <span className={`font-black px-2 py-0.5 rounded ${profileData.subscription.days_left && profileData.subscription.days_left > 10 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          {profileData.subscription.days_left} Days
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Edit Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <LayoutDashboard size={20} className="text-[#2B4399]" />
                Update Profile Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Full Name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    icon={<User size={18} />}
                    error={errors.full_name}
                    required
                  />
                  <Input
                    label="Company Name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    icon={<Building2 size={18} />}
                    error={errors.company_name}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    icon={<Mail size={18} />}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    icon={<MapPin size={18} />}
                  />
                </div>

                <Input
                  label="Address"
                  name="address"
                  as="textarea"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Input
                    label="Nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    placeholder="E.g. India"
                    icon={<Globe2 size={18} />}
                  />
                  <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    icon={<Map size={18} />}
                  />
                  <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    icon={<Flag size={18} />}
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                    className="bg-[#2B4399] hover:bg-[#1e3278] text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
