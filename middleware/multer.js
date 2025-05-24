// Import the multer library for handling multipart/form-data (file uploads)
import multer from 'multer'

// Configure storage settings for multer
const storage = multer.diskStorage({
    // Set the filename for the uploaded file
    filename: function(req, file, callback) {
        // Use the original file name for the uploaded file
        callback(null, file.originalname)
    }
})

// Create the upload middleware using the defined storage settings
const upload = multer({ storage: storage })

// Export the upload middleware for use in routes
export default upload