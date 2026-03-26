import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioNumber = process.env.TWILIO_PHONE_NUMBER
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

const client = twilio(accountSid, authToken)

// Diagnostic: Print credentials status (safe way)
if (process.env.NODE_ENV !== 'production') {
  console.log('--- Twilio Diagnostic ---')
  console.log('Account SID Length:', accountSid?.length || 0)
  console.log('Auth Token Length:', authToken?.length || 0)
  console.log('Verify Service SID:', verifyServiceSid ? 'Defined' : 'Missing')
  if (accountSid) console.log('Account SID starts with:', accountSid.substring(0, 4))
  console.log('-------------------------')
}

export async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      body,
      from: twilioNumber,
      to,
    })
    console.log('SMS sent successfully:', message.sid)
    return { success: true, sid: message.sid }
  } catch (error: any) {
    console.error('Error sending SMS:', error)
    return { success: false, error: error.message }
  }
}

export async function notifyWorkerHired(workerPhone: string, workerName: string, jobTitle: string, farmerPhone: string) {
  const body = `Hello ${workerName}, you have been hired for the task: "${jobTitle}". Please contact the farmer at ${farmerPhone} for further details. - FarmWorks`
  return sendSMS(workerPhone, body)
}

/**
 * Formats a phone number to E.164 format (e.g., +919876543210)
 */
function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) return `+91${cleaned}`
  if (cleaned.length === 12 && cleaned.startsWith('91')) return `+${cleaned}`
  if (phone.startsWith('+')) return phone
  return `+${cleaned}`
}

/**
 * Sends an OTP using Twilio Verify Service
 */
export async function sendOTP(to: string) {
  try {
    if (!verifyServiceSid) throw new Error('TWILIO_VERIFY_SERVICE_SID is not defined')
    
    const formattedPhone = formatPhoneNumber(to)
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' })
    
    console.log('OTP request status:', verification.status)
    return { success: true }
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Verifies an OTP using Twilio Verify Service
 */
export async function verifyOTP(to: string, code: string) {
  try {
    if (!verifyServiceSid) throw new Error('TWILIO_VERIFY_SERVICE_SID is not defined')

    const formattedPhone = formatPhoneNumber(to)
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: formattedPhone, code })
    
    if (verificationCheck.status === 'approved') {
      console.log('OTP verified successfully')
      return { success: true }
    } else {
      console.warn('OTP verification failed:', verificationCheck.status)
      return { success: false, error: 'Invalid or expired verification code' }
    }
  } catch (error: any) {
    console.error('Error verifying OTP:', error)
    return { success: false, error: error.message }
  }
}
