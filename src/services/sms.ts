import twilio from 'twilio'
// send verification message to the client
export default async function verifyPhoneNum(phone: string): Promise<string>{
    const account_sid = process.env.TWILIO_ACCOUNT_SID;
    const auth_token = process.env.TWILIO_AUTH_TOKEN;
    const sender_phone = process.env.TWILIO_PHONE_NUMBER;
    const client = twilio(account_sid, auth_token);

    return new Promise(async (resolve, reject) => {
        try {
            // the code that will send to the client
            const code = String(Math.random()).slice(2, 6);
            const messageConfig = {
                body: `e-com-app verification code ${code}`,
                from: sender_phone,
                to: phone
            }
            await client.messages.create(messageConfig);
            resolve(code)
        } catch(err) {
            reject(err)
        }
    })
}