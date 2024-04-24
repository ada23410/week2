const http = require('http');
const Post = require('./model/posts')
const errorHandle = require('./errorHandle')
const mongoose = require('mongoose');
const dotenv= require('dotenv');

dotenv.config({path:"./config.env"});

const DB = process.env.DATABASE.replace(
    '<password>',
    encodeURIComponent(process.env.DATABASE_PASSWORD)
)

mongoose.connect(DB)
.then(()=> {console.log('資料庫連線成功')})
.catch((error)=> {console.log('資料連線失敗',error)});

const requestListener = async(req, res)=>{
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    req.on('data', chunk=>{
        body+=chunk;
    })
    
    if(req.url=="/posts" && req.method == "GET"){
        try{
            const post = await Post.find();
            res.writeHead(200,headers);
            res.write(JSON.stringify({
                "status": "success",
                post
            }));
            res.end();
        }catch(error){
            errorHandle(res, error)
        }
    }else if(req.url=="/posts" && req.method == "POST"){
        req.on('end',async()=>{
            try{
                const data = JSON.parse(body);
                if(data.content && data.content.trim() !== ''){
                    const newPost = await Post.create(
                        {
                            name: data.name,
                            content: data.content.trim(),
                            tags: data.tags,
                            type: data.type
                        }
                    );
                    res.writeHead(200,headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": newPost,
                    }));
                    res.end();
                }else{
                    errorHandle(res)
                }
            }catch(error){
                errorHandle(res, error)
            }
        })
    }else if (req.url=="/posts" && req.method == "DELETE"){
        try{
            await Post.deleteMany({});
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                data: []
            }));
            res.end();
        }catch (error) {
            errorHandle(res, error)
        }
    }else if(req.url.startsWith("/posts/") && req.method=="DELETE"){
        const id = req.url.split('/').pop();
        try{
            const deletePost = await Post.findByIdAndDelete(id);
            if(deletePost){
                res.writeHead(200,headers);
                res.write(JSON.stringify({
                    "status": "success",
                    "data": null,
                }));
                res.end();
            }else{
                errorHandle(res)
            }
        }catch (error){
            errorHandle(res, error)
        }
    }else if(req.url.startsWith('/posts/') && req.method == 'PATCH') {
        req.on('end', async()=> {
			try{
				const postId = req.url.split('/').pop();
				const updatedPostData = JSON.parse(body); 
				const posts = await Post.findByIdAndUpdate({_id: postId}, updatedPostData, { new: true }); 
                if(posts){
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": posts
                    }));
                    res.end();
                }else{
                    errorHandle(res)
                }
			}catch{
                errorHandle(res, error)
			}
		})
    }else if(req.method == "OPTIONS"){
        res.writeHead(200,headers);
        res.end();
    }else{
        res.writeHead(404,headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3000);