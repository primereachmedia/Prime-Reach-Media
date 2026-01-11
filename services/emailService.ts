
/**
 * Prime Reach Media - Real Email Integration
 * Powered by EmailJS (https://www.emailjs.com/)
 */
import emailjs from 'https://esm.sh/@emailjs/browser';

// --- CONFIGURATION ---
// Service ID from your previous setup
const SERVICE_ID = "service_29a0q16"; 

// Template ID from your previous setup
const TEMPLATE_ID = "template_nz2wwjf"; 

// CORRECTED PUBLIC KEY from your latest screenshot
// Note: We MUST use the Public Key for frontend integrations.
const PUBLIC_KEY = "vMMvROc8gfXWbU0Ge";

/**
 * Sends a verification email via EmailJS
 */
export const sendVerificationEmail = async (email: string, role: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`[EmailService] Initializing transmission for: ${email} (${role})`);

    if (!TEMPLATE_ID) {
      return { success: false, error: 'TEMPLATE_ID_MISSING' };
    }

    // Explicitly initialize with the correct PUBLIC KEY
    emailjs.init(PUBLIC_KEY);

    const templateParams = {
      user_email: email,
      user_role: role.toUpperCase(),
      to_email: email, 
      reply_to: 'support@primereachmedia.com'
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('[EmailService] Status: Success. Transmission delivered.');
      return { success: true };
    } else {
      console.error('[EmailService] API Error Response:', response);
      return { success: false, error: `API_ERROR_${response.status}: ${response.text}` };
    }

  } catch (err: any) {
    console.error('[EmailService] Critical Error:', err);
    // Surface the actual error message from EmailJS if available
    const errorMsg = err?.text || err?.message || 'CONNECTION_FAILED';
    return { success: false, error: errorMsg };
  }
};
