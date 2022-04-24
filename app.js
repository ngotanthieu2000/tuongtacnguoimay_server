const path = require('path')
const fs = require('fs')
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

async function uploadFile() {
    try{
        const response = await drive.files.create({
            requestBody: {
                name: 'avatar.jpg', //file name
                mimeType: 'image/jpg',
                parents:['1ZvlFbOKCioTEk6v43R1GE9W3GJiMtt5j']
            },
            media: {
                mimeType: 'image/jpg',
                body: fs.createReadStream(path.join(__dirname,'avatar1.jpg')),
            },
        });  
        
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
            fields: 'webViewLink, webContentLink',
        });

        console.log({Data:result.data,fileId});
    }catch (error) {
        //report the error message
        console.log(error.message);
    }
}  
async function deleteFile(fileId) {
    try {
        const response = await drive.files.delete({
            fileId
        });
        console.log(response.data);
    } catch (error) {
        console.log(error.message);
    }
  }
uploadFile()
// deleteFile('1wxmC2Z4d7waRPBTWHAD3V8OqivJlVmwt')



// Access scopes for read-only Drive activity.

  
  // Generate a url that asks permissions for the Drive activity scope
  
// const authorizationUrl = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: 'offline',
//     /** Pass in the scopes array defined above.
//       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
//     scope: scopes,
//     // Enable incremental authorization. Recommended as a best practice.
//     include_granted_scopes: true
//   });
//   console.log(authorizationUrl)

// let userCredential = null;
// async function main (){
//     const server = http.createServer(async function (req, res) {
//         // Example on redirecting user to Google's OAuth 2.0 server.
//         console.log(authorizationUrl)
//         if (req.url == '/') {
//             res.writeHead(301, { "Location": authorizationUrl });
//         }

//         // Receive the callback from Google's OAuth 2.0 server.
//         if (req.url.startsWith('/oauth2callback')) {
//             // Handle the OAuth 2.0 server response
//             let q = url.parse(req.url, true).query;

//             if (q.error) // An error response e.g. error=access_denied
//             console.log('Error:' + q.error);
//             else 
//             { // Get access and refresh tokens (if access_type is offline)
//             let { tokens } = await oauth2Client.getToken(q.code);
//             oauth2Client.setCredentials(tokens);

//             /** Save credential to the global variable in case access token was refreshed.
//                  * ACTION ITEM: In a production app, you likely want to save the refresh token
//                  *              in a secure persistent database instead. */
//             userCredential = tokens;
//             }
//         }
//     })
// }
// main ()