var fs = require('fs')
exports.getAll = function (callback) {
    fs.readdir('./uploads',function (err,files) {
        if(err) {
            callback("没有",null)
            return
        }
        var All = []
        ;(function iterator(i) {
            if(i == files.length) {
                callback(null,All)
                return
            }
            fs.stat('./uploads/' + files[i],function (err,stats) {
                if(stats.isDirectory()){
                    All.push(files[i])
                }
                iterator(i+1)
            })
        })(0)

    })
}
exports.getImg = function (file,callback) {
    fs.readdir('./uploads/'+ file,function (err,files) {
        if(err) {
            callback("没有",null)
            return
        }
        var All = []
        ;(function iterator(i) {
            if(i == files.length) {
                callback(null,All)
                return
            }
            fs.stat('./uploads/'+ file+'/' + files[i],function (err,stats) {
                if(stats.isFile()){
                    All.push(files[i])
                }
                iterator(i+1)
            })
        })(0)
    })
}