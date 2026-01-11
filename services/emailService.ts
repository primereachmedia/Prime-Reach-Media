/**
 * Prime Reach Media - Real Email Integration
 * Powered by EmailJS (https://www.emailjs.com/)
 */
import emailjs from 'https://esm.sh/@emailjs/browser';

// --- CONFIGURATION ---
// 1. Service ID: Obtained from your screenshot
const SERVICE_ID = "service_29a0q16"; 

// 2. Template ID: Obtained from your screenshot
const TEMPLATE_ID = "template_nz2wwjf"; 

// 3. Public Key: Provided by you 
const PUBLIC_KEY = "e6GZzuU6yMrasp0IH8Uq0";

/**
 * Sends a verification email via EmailJS
 */
export const sendVerificationEmail = async (email: string, role: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`[EmailService] Initializing transmission for: ${email} (${role})`);

    // Safety check to prevent crashing if Template ID is still the placeholder
    // Fix: Removed comparison with 'YOUR_TEMPLATE_ID' literal which caused a type overlap error after configuration.
    if (!TEMPLATE_ID) {
      console.warn("⚠️ PRM ALERT: Template ID is missing in services/emailService.ts. Emails will not send until this is set.");
      // Fallback simulation so the UI still works during your setup
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true }; 
    }

    const templateParams = {
      user_email: email,
      user_role: role.toUpperCase(),
      to_email: email, // Ensure your EmailJS Template "To Email" field contains {{to_email}}
      reply_to: 'support@primereachmedia.com'
    };

    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      PUBLIC_KEY
    );

    if (response.status === 200) {
      console.log('[EmailService] Status: Success. Transmission delivered to gateway.');
      return { success: true };
    } else {
      throw new Error(`Email delivery failed with status: ${response.status}`);
    }

  } catch (err) {
    console.error('[EmailService] Critical Error:', err);
    return { success: false, error: 'SERVICE_CONNECTION_FAILED' };
  }
};