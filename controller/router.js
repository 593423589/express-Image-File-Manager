var files = require('../modules/file.js')
var formidable = require('formidable')
var fs = require('fs')
var url = require('url')
var path = require('path')
var querystring = require("querystring")
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
var my_file = 0;


exports.showIndex = function (req,res,next) {
   files.getAll(function (err,All) {
       if(err){
           next()
           return
       }
       res.render('index',{
           'albums' : All
       })
   })
}
exports.showUpload = function (req,res,next) {
    files.getAll(function (err,All) {
        if(err){
            next()
            return
        }
        console.log(All);
        res.render('upload',{
            'albums' : All
        })
    })
}
exports.showCreate = function (req,res,next) {
    // console.log(unescape(req.url))
    res.render('create')

    if(req.url!="/create"){
        var my_url = req.url.slice(8)
        my_url = decodeURIComponent(my_url);
        var my_path = './uploads/'+my_url
        fs.mkdir(my_path,function (err) {
            if(err) throw err
        })

    }


}
exports.showdeldir = function (req,res,next) {
    files.getAll(function (err,All) {
        if(err){
            next()
            return
        }
        res.render('deldir',{
            'albums' : All
        })
    })
}
exports.deldir =(req,res,next)=>{
    var dirpath = decodeURIComponent(req.body.name)
    dirpath = "uploads/" + dirpath.split("#")[1]
    console.log(dirpath);

    function deleteall(path) {
        var files = [];
        if(fs.existsSync(path)) {   //如果存在路径
            files = fs.readdirSync(path);   //返回文件夹数组
            files.forEach(function(file,index) {
                var curPath = path + "/" + file;
                if(fs.statSync(curPath).isDirectory()) { // recurse
                    deleteall(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    }
    deleteall(dirpath)
    res.send("yes")
}
exports.delImg = function (req,res,next) {
    var img_path =decodeURIComponent(req.body.name).split("/")
    img_path = "uploads/"+ img_path[3] + "/" +img_path[4]
        fs.unlink(img_path,function (err) {
        if(err) throw err
    });


    // var data = ''
    // //2.注册data事件接收数据（每当收到一段表单提交的数据，该方法会执行一次）
    // req.on('data', function (chunk) {
    //     // chunk 默认是一个二进制数据，和 data 拼接会自动 toString
    //     data += chunk
    // })
    //
    // // 3.当接收表单提交的数据完毕之后，就可以进一步处理了
    // //注册end事件，所有数据接收完成会执行一次该方法
    // req.on('end', function () {
    //
    //     //（1）.对url进行解码（url会对中文进行编码）
    //     data = decodeURI(data)
    //     console.log(data)
    //
    //     /**post请求参数不能使用url模块解析，因为他不是一个url，而是一个请求体对象 */
    //
    //         //（2）.使用querystring对url进行反序列化（解析url将&和=拆分成键值对），得到一个对象
    //         //querystring是nodejs内置的一个专用于处理url的模块，API只有四个，详情见nodejs官方文档
    //     var dataObject = querystring.parse(data)
    //     console.log(dataObject)
    // })


}

exports.showAlbum = function (req,res,next) {
    var albumname = req.params.name;
    files.getImg(albumname,function (err,All) {
        if(err) {
            next()
            return
        }
        res.render('my_img',{
            'albumname' : albumname,
            'images' : All
        })
    })
}
exports.upload = function (req, res, next) {
    // console.log(req.on('data',function (data) {
    //     //     var currentData = '';
    //     //     currentData += data;
    //     //     var obj = null;
    //     //     obj = queryString.parse(currentData)
    //     //     console.log(obj);
    //     // }));
    if (req.method.toLowerCase() == 'post') {
        // parse a file upload
        var form = new formidable.IncomingForm();
        form.uploadDir = './uploads';
        // form.keepExtensions=true;
        form.multiples = true;
        var my_files=[];
        //文件都将保存在files数组中
        form.on('file', function (filed,file) {
            my_files.push([filed,file]);
        })
        form.parse(req, function (err, fields, files) {
            if (err) throw err;
            // console.log(my_file.length);
            if(fields.position != "请选择") {
                var my_position = fields.position;
                for(var i =0 ; i < my_files.length ; i ++) {
                    var extname = path.extname(my_files[i][1].name);
                    var oldname = __dirname + "/../" + my_files[i][1].path;
                    var newname = "./uploads/"+my_position+"/" +my_files[i][1].name;
                    console.log(my_files[i][1].name);
                    // console.log(newname);
                    fs.rename(oldname, newname, function (err) {
                        if (err) throw err;
                        console.log("改名成功");
                    });
                }
            }
            res.writeHead(200, {'content-type': 'text/html;charset=utf8'});
            res.write('<button  style="width: 8em;height: 5em ; font-size: 3em; font-weight: bolder" onclick="btn()">点击返回</button><script >function btn() { history.go(-1)}</script>');
            // res.end(util.inspect({fields: fields, files: files}));
            res.end('&nbsp;成功!');

        });
    }
}