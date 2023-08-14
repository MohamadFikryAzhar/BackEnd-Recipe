const emailTemplate = (text) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Welcome Email</title>
        </head>
        <body>
            ${text}
        </body>
        </html>  
    `
    }
    
export default emailTemplate;