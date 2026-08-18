export interface EndPointApi {
  AUTH: {
    SEND_LOGIN_OTP: string;
    VERIFY_LOGIN_OTP: string;
    SEND_SIGN_UP_OTP: string;
    VERIFY_SIGN_UP_OTP: string;
  };
}

// Define and export the standard API endpoint object
const endPointApi: EndPointApi = {
  AUTH: {
    SEND_LOGIN_OTP: 'send_login_otp',
    VERIFY_LOGIN_OTP: 'verify_login_otp',
    SEND_SIGN_UP_OTP: 'send_sign_up_otp',
    VERIFY_SIGN_UP_OTP: 'verify_sign_up_otp',
  },
};

export default endPointApi;


