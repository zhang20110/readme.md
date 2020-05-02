function ajax(method, url, data, callback, token, async) {
    if (token != 0 && !token) {
        location.href = 'login.html';
    }
    let location = 'http://182.92.121.195:8080/progress/';
    //创建Ajax对象
    var xhr = new XMLHttpRequest();
    // 告诉Ajax向哪里发送请求 以什么方式发送请求
    // 1） 请求方式  2）请求地址
    if (method === 'get') {
        if (async) {
            xhr.open(method, location + url + '?' + data, false);
        } else {
            xhr.open(method, location + url + '?' + data);
        }
        // 设置token
        if (token) {
            xhr.setRequestHeader('token',token);
        }
        // 发送请求
        xhr.send();
        // 获取服务器端响应到客户端的数据
        xhr.onload = function() {
            callback && callback(JSON.parse(xhr.responseText));
        };   
    } else if (method === 'post' || method === 'delete') {
        if (async) {
            xhr.open(method, location + url, false);
        } else {
            xhr.open(method, location + url);
        }
        // 设置 token 
        if (token) {
            xhr.setRequestHeader('token',token);
        }
        // 以json格式传递数据 
        xhr.setRequestHeader('Content-type', 'application/json');
        if (data) {
            xhr.send(JSON.stringify(data));
        } else {
            xhr.send();
        }
        xhr.onload = function() {
            callback && callback(JSON.parse(xhr.responseText));
        };
    }
}
function getTime(a) {
    if (a) {
        var myTime = new Date(a);
    } else {
        var myTime = new Date();
    }
    let year = myTime.getFullYear();
    let month = myTime.getMonth() + 1;
    let day = myTime.getDate();
    return year + '-' + month + '-' + day;
}