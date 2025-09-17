// firebase.ts
import admin from "firebase-admin"
import dotenv from "dotenv"
dotenv.config()

if (
  !process.env.FIREBASE_TYPE ||
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL ||
  !process.env.FIREBASE_CLIENT_ID
) {
  throw new Error("Missing Firebase environment variables")
}

// Create service account object
const serviceAccount: any = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID
}

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "movie-booking-system-images.appspot.com" // your bucket
})

const bucket = admin.storage().bucket()

export default bucket
// gs://hyper-tech-425e4.firebasestorage.app/movie-booking-system-images
