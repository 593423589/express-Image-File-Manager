var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
var router = require('./controller')


app.set('view engine','ejs')
// app.set('view','./views')
app.use(express.static('./public'))
app.use(express.static('./uploads'))

app.get('/',router.showIndex)
app.get('/deldir',router.showdeldir)
app.post('/deldir',router.deldir)
app.post('/upload',router.upload)


// app.post('/upload2',function (req,res) {
//     req.on('data',function (data) {
//         console.log(data.toString());
//     })
// })
app.post('/delImg',router.delImg)
app.get('/upload',router.showUpload)
app.get('/create',router.showCreate)


app.get('/:name',router.showAlbum)
app.get('/news',function (req,res) {

    setTimeout(()=>{
            let mydata = [{'name':'wyh','sex':'man'},{'name':'zsq','sex':'women'}]
            res.send("err")
        },1000)

    // res.json(data);
})

app.use(function (req,res) {
    res.render('err');
})
// app.get('/:id', function (req, res) {
//     var id = req.params['id'];
//     var re = /^[\d]{6}$/;
//     if(re.test(id)){
//         res.send(id)
//         return
//     }
//     // else{
//
//         res.send('有毛病')
//
//     // }
// })
// app.get('/:id',function(req,res) {
//     var id = req.params['id'];
//     var re = /^[A-Za-z]{2}$/;
//     if(re.test(id)){
//         res.send(id)
//         return
//     }
//     // else{
//     res.send('22有毛病')
//
//     // }
// })
app.listen(8888)