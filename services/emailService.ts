
/**
 * Prime Reach Media - Production Email Protocol
 * Powered by EmailJS
 */
import emailjs from 'https://esm.sh/@emailjs/browser';

const SERVICE_ID = "service_29a0q16"; 
const TEMPLATE_ID = "template_nz2wwjf"; 
const PUBLIC_KEY = "vMMvROc8gfXWbU0Ge";

export const sendVerificationEmail = async (email: string, role: string): Promise<{ success: boolean; passcode?: string; error?: string }> => {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'INVALID_CREDENTIALS_PROVIDED' };
    }

    console.info(`[PRM_AUTH] Dispatching secure token to: ${email}`);

    emailjs.init(PUBLIC_KEY);

    // Secure token generation (6-digit OTP)
    const generatedPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Window of validity (15 minutes)
    const expiryDate = new Date(Date.now() + 15 * 60000);
    const timeString = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const templateParams = {
      to_email: email,      
      passcode: generatedPasscode,
      time: timeString,
      user_role: role.toUpperCase(),
      reply_to: 'primereachmediamarket@gmail.com'
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      console.info('[PRM_AUTH] Secure token successfully delivered.');
      return { success: true, passcode: generatedPasscode };
    } else {
      console.error('[PRM_AUTH] Dispatch Failure:', response);
      return { success: false, error: `Error Code ${response.status}: Delivery Blocked.` };
    }

  } catch (err: any) {
    console.error('[PRM_AUTH] System Exception:', err);
    return { success: false, error: 'SERVICE_UNAVAILABLE: Check your network connection.' };
  }
};
