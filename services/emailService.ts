
/**
 * Prime Reach Media - Real Email Integration
 * Powered by EmailJS (https://www.emailjs.com/)
 */
import emailjs from 'https://esm.sh/@emailjs/browser';

// --- CONFIGURATION ---
const SERVICE_ID = "service_29a0q16"; 
const TEMPLATE_ID = "template_nz2wwjf"; 
const PUBLIC_KEY = "vMMvROc8gfXWbU0Ge";

/**
 * Sends a verification email via EmailJS
 * Returns the passcode so the frontend can simulate verification.
 */
export const sendVerificationEmail = async (email: string, role: string): Promise<{ success: boolean; passcode?: string; error?: string }> => {
  try {
    if (!email || !email.includes('@')) {
      return { success: false, error: 'INVALID_EMAIL_PROVIDED' };
    }

    console.log(`[EmailService] Preparing transmission for: ${email}`);

    emailjs.init(PUBLIC_KEY);

    // Generate a 6-digit OTP passcode
    const generatedPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calculate expiry time (15 minutes from now)
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
      console.log('[EmailService] Transmission successful.');
      return { success: true, passcode: generatedPasscode };
    } else {
      console.error('[EmailService] API Error:', response);
      return { success: false, error: response.text || `Error ${response.status}` };
    }

  } catch (err: any) {
    console.error('[EmailService] Exception:', err);
    const errorMsg = err?.text || err?.message || 'CONNECTION_FAILED';
    return { success: false, error: errorMsg };
  }
};
