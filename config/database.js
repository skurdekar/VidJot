if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://shailesh:shailesh@ds135421.mlab.com:35421/sskdb'}
}else{
    module.exports = {mongoURI: 'mongodb://localhost:27017/vidjot-dev' }
}