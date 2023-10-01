const http = require('http');
const url = require('url');
const query = require('querystring');
const jsonHandler = require('./jsonResponses.js');
const htmlHandler = require('./htmlResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getCSS,
        '/getUsers': jsonHandler.getUsers,
        '/notReal': jsonHandler.notReal,
        notFound: jsonHandler.notFound,
    },
    HEAD: {
        '/getUsers': jsonHandler.getUsersMeta,
        '/notReal': jsonHandler.notRealMeta,
        notFound: jsonHandler.notFoundMeta,
    },
    POST: {
        '/addUser': jsonHandler.addUser,
        notFound: jsonHandler.notFound,
    },
};

const onRequest = (request, response) => {
    const parsedUrl = url.parse(request.url);

    // Check for handled request type
    if (!urlStruct[request.method]) {
        return urlStruct.HEAD.notFound(request, response); // Send 404 error code
    }

    // Check for handled response url
    if (urlStruct[request.method][parsedUrl.pathname]) {
        return urlStruct[request.method][parsedUrl.pathname](request, response); // Handle response
    }

    return urlStruct[request.method].notFound(request, response); // Send 404 and maybe body
}

http.createServer(onRequest).listen(port, () => console.log(`listening on 127.0.0.1:${port}`));