const { fs, vol } = require('memfs');
const express = require('express');

rmDir = function(dirPath) {
  try { var files = fs.readdirSync(dirPath); }
  catch(e) { return; }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile())
        fs.unlinkSync(filePath);
      else
        rmDir(filePath);
    }
    fs.rmdirSync(dirPath);
};

const app = express();

app.use(express.json());
app.use(express.static(process.cwd()));

app.post('/api/fetchFiles', function(req, res){
  res.send(fs.readdirSync("/" + req.body.rancode));
});
app.post('/api/init', function(req, res){
  var rancode = Math.random().toString().split(".").pop();
  fs.mkdirSync("/" + rancode);
  res.send({fs: rancode});
})

app.post('/api/saveFile', function(req, res){
  fs.writeFileSync(`/${req.body.rancode}/${req.body.fileName}`, req.body.content);
  res.send({success: true});
})

app.post('/api/writeFile', function(req, res){
  fs.writeFileSync(`/${req.body.rancode}/${req.body.fileName}`, req.body.content);
  res.send({success: true});
})

app.post('/api/getFile', function(req, res){
  res.send({content: fs.readFileSync("/" + req.body.rancode + "/" + req.body.fileName, 'utf8')});
})

app.post('/api/removeFile', function(req, res){
  fs.unlinkSync(`/${req.body.rancode}/${req.body.fileName}`);
  res.send({success: true});
})

app.post('/api/exit', function(req, res){
  rmDir("/" + req.body.fs);
  res.send({exited: true});
})

app.listen(3000, () => {
  console.log('server started');
});
``