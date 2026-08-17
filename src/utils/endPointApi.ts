export interface EndPointApi {
    send_login_otp: string;
    verify_login_otp: string;
    send_sign_up_otp: string;
    verify_sign_up_otp: string;
    // Add new dynamic API endpoints here as needed
}

// Define and export the standard API endpoint object
const endPointApi: EndPointApi = {
    send_login_otp: 'send_login_otp',
    verify_login_otp: 'verify_login_otp',
    send_sign_up_otp: 'send_sign_up_otp',
    verify_sign_up_otp: 'verify_sign_up_otp',
    // Add your module-specific endpoints below as the project scales
};

export default endPointApi;

