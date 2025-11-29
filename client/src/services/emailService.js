import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const sendOTPEmail = async (email, otp) => {
  try {
    const emailMessage = `Your OTP: ${otp}\n\nThis OTP will be valid for 15 minutes.\nDo not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.\n\nBest regards,\nUCUBE.AI Team`;
    
    const templateParams = {
      to_email: email,
      message: emailMessage,
      from_name: 'UCUBE.AI',
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
