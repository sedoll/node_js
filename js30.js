const dbCon = require("./model/sample.js");
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser= require('body-parser');
let title = "";
let tmp1 = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>샘플</title>
</head>
<body>
    <ul>
        <li><a href="/">메인</a></li>
        <li><a href="/sample/list">목록</a></li>
        <li><a href="/sample/addSample">샘플 추가</a></li>
    </ul>
    <hr>
`;
let tmp2 = `</body>
</html>`;
app.get('/', (req, res) => {
    res.sendFile(__dirname+"/sampleMain.html");
});
app.get('/sample/list', (req, res) => {
    title = `<h2>샘플 항목</h2>`;
    let ul = `<ul>`;
    dbCon.getSampleList()
        .then((rows) => {
            let li = rows.map((row) => {
                console.log(row);
                return `<li><a href="/sample/get/${row.NO}">${row.NAME}</a></li>`;
            });
            li.map((tag) => {
                ul = ul + tag;
            });
            ul = ul + `</ul>`;
            res.send(tmp1+title+ul+tmp2);
        })
        .catch((errMsg) => {
            res.send(tmp1+title+errMsg+tmp2);
        });
});
app.get('/sample/get/:no', (req, res) => {
    title = `<h2>샘플 상세보기</h2>`;
    let body = "";
    dbCon.getSample(req.params.no)
        .then((row) => {
            let body = row.map((data) => {
                return `<li><a href="/sample/get/${data.NO}">${data.NAME}</a></li>`;
            });
            let btn = row.map((data) => {
                return `<hr><a href="/sample/sampleUpdate/${data.NO}/${data.NAME}">수정</a>
                <hr><a href="/sample/sampleDelete/${data.NO}">삭제</a>`;
            });
            res.send(tmp1+title+body+btn+tmp2);
        })
        .catch((errMsg) => {
            res.send(errMsg);
        });
});
app.get('/sample/addSample', (req, res) => {
    res.sendFile(__dirname+"/sampleForm.html");
});
app.post('/sample/addSamplePro', (req, res) => {
    let sample = {no:req.body.no, name:req.body.name};
    dbCon.addSample(sample)
    .then((msg) => {
        console.log(msg);
        res.redirect("/sample/list");
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });    
});
app.get('/sample/sampleUpdate/:no/:name', (req, res) => {
    title = `<h2>샘플 수정하기</h2>`;
    let form = `
    <form action="/sample/sampleUpdatePro" method="post">
        <p><input type="hidden" name="no" value="${req.params.no}" placeholder="no hidden"></p>
        <p><input type="text" name="name" value="${req.params.name}" placeholder="name input"></p>
        <p><input type="submit"></p>
    </form>
    `;
    res.send(tmp1+title+form+tmp2); 
});
app.post('/sample/sampleUpdatePro', (req, res) => {
    let sample = {no:req.body.no, name:req.body.name};
    console.log(sample);
    dbCon.editSample(sample)
    .then((msg) => {
        console.log(msg);
        res.redirect("/sample/list");
    })
    .catch((errMsg) => {
        console.log(errMsg);
    }); 
});
app.get('/sample/sampleDelete/:no', (req, res) => {
    let no = req.params.no;
    dbCon.delSample(no)
    .then((msg) => {
        console.log(msg);
        res.redirect("/sample/list");
    })
    .catch((errMsg) => {
        console.log(msg);
    });
});
let port = 4000;
app.listen(port, () => {
    console.log(`Sever Starting on ${port}`);
});

/*
request 객체 : 요청 받은 객체(데이터)
    request.params : URL의 파라미터로 가져올 경우(Get) 활용 : localhost:4000/kim => /:id
        request.params.id => kim 처럼 url 파라미터의 값을 가져오는 경우
    request.body : 폼으로 요청된 데이터를 가져올 경우(Post) 활용 : localhost:4000/addBoard
        request.body.title => 폼에 입력되었던 title(제목)의 값을 지칭
    request.query : 쿼리스트링 파라미터에 전부를 가져온다.
    request.headers : header 값을 가져온다.
    request.cookies : 쿠키값을 확인한다. 
    request.ip : 프론트 아이피를 가져온다
    request.protocol : 프로토콜 http? https? 인지 가져온다
    request.url : 전체 URI 정보를 가져온다.    

response 객체 : 응답하는 객체(데이터)
    response.send() : 클라이언트에 응답을 보낼 수 있다. 디버깅에서 많이 사용
    response.sendFile() : 클라이언트에 해당 파일을 보여준다.
    response.json() : 클라이언트에 자동으로 json을 만들어준다
    response.jsonp() : 클라이언트에 자동으로 jsonp을 만들어준다
    response.redirect() : 리다이렉트, 페이지를 이동 시킨다.  
*/