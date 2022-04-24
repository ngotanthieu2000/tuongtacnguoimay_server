const fs = require('fs')
const { unlink } = require('fs/promises')
const {google} = require('googleapis')
require('dotenv').config()
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN
const oauth2Client = new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
const scopes = ['https://www.googleapis.com/auth/drive']

oauth2Client.setCredentials({
    refresh_token:REFRESH_TOKEN
})

const drive = google.drive({
    version:'v3',
    auth:oauth2Client
})

const multer = require('multer');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './images');
  },
  filename: function(req, file, cb) {
    cb(null,file.originalname)
  },
});

var upload = multer({ storage });
module.exports = {
    multer:multer,
    upload:upload,
    uploadFile: async function (name,filePath,animals) {
        try{
            const response = await drive.files.create({
                requestBody: {
                    name: `${name}-image.jpg`, //file name
                    mimeType: 'image/jpg',
                    parents: animals ? ['1jHBJOjYfE6NUR1bjUiJL8pBcgnYTqjr8']:['1ZvlFbOKCioTEk6v43R1GE9W3GJiMtt5j']
                },
                media: {
                    mimeType: 'image/jpg',
                    body: fs.createReadStream(filePath),
                },
            });  
            await unlink(filePath)
            const fileId = response.data.id;
            //change file permisions to public.
            await drive.permissions.create({
                fileId: fileId,
                requestBody: {
                role: 'reader',
                type: 'anyone',
                },
            });
            //obtain the webview and webcontent links
            const result = await drive.files.get({
                fileId: fileId,
                avatar:'webViewLink',
                fields: 'webViewLink, webContentLink',
            });
    
            // console.log({Data:result.data,fileId});
            // console.log(result)
            return `https://drive.google.com/uc?export=view&id=${fileId}`
        }catch (error) {
            //report the error message
            console.log(error.message);
        }
    },
    deleteFile: async function (fileId) {
        try {
            const response = await drive.files.delete({
                fileId
            });
            console.log(response.data);
        } catch (error) {
            console.log(error.message);
        }
      }
}