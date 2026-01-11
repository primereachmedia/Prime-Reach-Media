
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
 */
export const sendVerificationEmail = async (email: string, role: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Basic validation
    if (!email || !email.includes('@')) {
      return { success: false, error: 'INVALID_EMAIL_PROVIDED' };
    }

    console.log(`[EmailService] Preparing transmission for: ${email}`);

    // Explicitly initialize with the Public Key
    emailjs.init(PUBLIC_KEY);

    // Generate a simulated 6-digit OTP passcode as seen in the template screenshot
    const generatedPasscode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Calculate expiry time (15 minutes from now) for the {{time}} variable
    const expiryDate = new Date(Date.now() + 15 * 60000);
    const timeString = expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    /**
     * templateParams matches the variables in your EmailJS template screenshot:
     * - {{to_email}}: Used in the "To Email" field
     * - {{passcode}}: The One Time Password
     * - {{time}}: The expiration time
     */
    const templateParams = {
      to_email: email,      
      passcode: generatedPasscode,
      time: timeString,
      user_role: role.toUpperCase(),
      reply_to: 'primereachmediamarket@gmail.com' // Matching your template's reply-to
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      console.log('[EmailService] Transmission successful with passcode:', generatedPasscode);
      return { success: true };
    } else {
      console.error('[EmailService] API Error:', response);
      return { success: false, error: response.text || `Error ${response.status}` };
    }

  } catch (err: any) {
    console.error('[EmailService] Exception:', err);
    // Surface the actual error text from EmailJS
    const errorMsg = err?.text || err?.message || 'CONNECTION_FAILED';
    return { success: false, error: errorMsg };
  }
};
