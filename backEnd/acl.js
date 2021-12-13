const admin = {
    '/api/categories': ['delete', 'get', 'post', 'put'],
    '/api/events': ['delete', 'get', 'post', 'put'],
    '/api/users': ['delete', 'get', 'post', 'put']
}

app.use( ( req, res, next ) => {
    
    console.log( 'method', req.method );
    console.log( 'url', req.url )
    next();
})