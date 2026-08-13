export interface EndPointApi {
    login: string;
    // register: string;
    // logout: string;
    // forgotPassword: string;
    // resetPassword: string;
    // getProfile: string;
    // updateProfile: string;

    // Add new dynamic API endpoints here as needed
}

// Define and export the standard API endpoint object
const endPointApi: EndPointApi = {
    login: 'auth/login',
    // register: 'auth/register',
    // logout: 'auth/logout',
    // forgotPassword: 'auth/forgot-password',
    // resetPassword: 'auth/reset-password',
    // getProfile: 'auth/profile',
    // updateProfile: 'auth/profile',

    // Add your module-specific endpoints below as the project scales
};

export default endPointApi;
