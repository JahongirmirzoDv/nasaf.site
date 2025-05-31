/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const functions = require("firebase-functions");
const { Resend } = require("resend"); // Resend kutubxonasini import qilish
const cors = require("cors")({origin: true});

// Resend API kaliti (Firebase environment variables orqali sozlanadi)
// Firebase konsolida: firebase functions:config:set resend.apikey="YOUR_RESEND_API_KEY"
const RESEND_API_KEY = functions.config().resend ? functions.config().resend.apikey : process.env.RESEND_API_KEY;
const SENDER_EMAIL = "noreply@YOUR_VERIFIED_DOMAIN.COM"; // Resend'da tasdiqlangan domendagi email (masalan, noreply@nasaf.com.uz)
const RECEIVER_EMAIL = "muhammadyusuf@nasaf.com.uz"; // Xabarlar keladigan email (o'zingiznikini yozing)

const resend = new Resend(RESEND_API_KEY);

exports.sendContactEmailWithResend = functions.region("europe-west1") // Regionni o'zingizga yaqinroq tanlang
    .https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== "POST") {
            return res.status(405).send("Method Not Allowed");
        }

        const { fullName, email, phone, subject, message } = req.body;

        if (!fullName || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: "Barcha kerakli maydonlar to'ldirilishi shart." });
        }

        try {
            const { data, error } = await resend.emails.send({
                from: `${fullName} <${SENDER_EMAIL}>`, // Yuboruvchi (Resend'da tasdiqlangan domendagi email)
                to: [RECEIVER_EMAIL], // Qabul qiluvchi
                reply_to: email, // Mijozga javob berish uchun
                subject: `Yangi Xabar (Resend orqali): ${subject}`,
                html: `
                    <p><strong>Ism:</strong> ${fullName}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Telefon:</strong> ${phone || "Kiritilmagan"}</p>
                    <p><strong>Mavzu:</strong> ${subject}</p>
                    <p><strong>Xabar:</strong></p>
                    <p>${message}</p>
                `,
            });

            if (error) {
                console.error("Resend email yuborishda xatolik:", error);
                return res.status(500).json({ success: false, message: "Xabar yuborishda xatolik yuz berdi.", errorDetails: error });
            }

            console.log("Email Resend orqali muvaffaqiyatli yuborildi!", data);
            return res.status(200).json({ success: true, message: "Xabaringiz muvaffaqiyatli yuborildi!" });

        } catch (error) {
            console.error("Cloud Function xatoligi:", error);
            return res.status(500).json({ success: false, message: "Serverda kutilmagan xatolik." });
        }
    });
});
