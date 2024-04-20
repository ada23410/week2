function errorHandle(res, error) {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    res.writeHead(400, headers);
    let message = '';
    if(error){
        message = error.message;
    }else{
        message = "欄位未填寫正確或無此id";
    }
    res.write(JSON.stringify({
        "status": "false",
        message
    }));
    res.end();
}

module.exports = errorHandle;