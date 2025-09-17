import admin from "firebase-admin"
import path from "path"

const serviceAccountPath = path.join(__dirname, "../../serviceAccountKey.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  storageBucket: "hyper-tech-425e4.firebasestorage.app"
})

const bucket = admin.storage().bucket()

export default bucket
// gs://hyper-tech-425e4.firebasestorage.app/movie-booking-system-images