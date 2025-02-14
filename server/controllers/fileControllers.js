const multer  = require('multer')

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const postProfileImage = async (req, res) => {

}