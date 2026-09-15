import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.api.ping()
  .then(result => console.log("SUCCESS:", result))
  .catch(err => console.error("FAILED:", err.message || err));