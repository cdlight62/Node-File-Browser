var http = require('http')
var url = require('url')
var fs = require('fs')
var path = require('path')
var ejs = require('ejs')
var dir = "C:\\Users\\cl77571"

var formatHtml = function(str){
  return str.replace(/&/g, "&amp").replace(/</g, "&lt").replace(/>/g, "&gt")
}

var saveFile = function(id){
  var html = document.getElementById(id).innerHTML
  fs.writeFile(filepath, html, function(err){
    if(err){
      return alert(err)
    }
    alert("File saved")
  })
}

var revertChanges = function(id){

}

var server = http.createServer(function callback (req, res){
  var request = url.parse(req.url, true)
  var pathname = request.pathname
  var query = request.query
  var filepath = path.join(dir, pathname)

  if (path.extname(filepath)){
    fs.readFile(filepath, 'utf8', function(err, data){
      if(!err){
        var formattedHtml = formatHtml(data)
        var template = fs.readFileSync('fileView.ejs', 'utf8')
        res.end(ejs.render(template, {
          formattedHtml: formattedHtml,
          filepath: filepath
        }))
        // res.writeHead(200, {'Content-Type': 'text/html'})
        // res.write('<a href="'+pathname.substring(0, pathname.lastIndexOf("/"))+'">back</a><br>')
        // res.end('<pre><code id="code" contenteditable="true">'+formatHtml(data)+'</code></pre><br><br>'+
        //   '<button type="button" onclick="saveFile(\'code\')">save</button>'+
        //   '<button type="button" onclick="revertChanges">undo</button>')
      }
      else{
        res.writeHead(404)
        res.end()
      }
    })
  }
  else{
    fs.readdir(filepath, function(err, files){
      if(!err){
        res.writeHead(200, {'Content-Type': 'text/html'})
        res.write('<a href="'+pathname.substring(0, pathname.lastIndexOf("/"))+'">..</a><br>')
        for (i = 0; i < files.length; i++){
          res.write('<a href="'+pathname + '/' + files[i] +'">'+files[i]+'</a><br>')
        }
        res.end()
      }
      else{
        res.writeHead(404)
        res.end()
      }
    })
  }
})
server.listen(8080)
