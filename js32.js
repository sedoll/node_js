//npm install node-mariadb
//브라우저에서 http://localhost:4000/board/list
const dbCon = require("./model/board.js");
const dbCon2 = require("./model/member.js");
const express = require("express");
const app = express();
const router = express.Router();
const bodyParser= require('body-parser');
app.use(express.urlencoded({ extended: false }));
const cors = require('cors');
app.use(cors());
/* 특정 URL만 CORS 허용 
app.use(cors({
    origin: "http://localhost:5500",
    credentials: true
}));
*/
app.get('/', (req, res) => {
    res.send("MAIN");
});
app.get('/board/list', (req, res) => {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
    dbCon.getBoardList()
        .then((rows) => {
            res.json(rows);
        })
        .catch((errMsg) => {
            res.send(errMsg);
        });
});
app.get('/board/get/:seq', (req, res) => {
    dbCon.getBoard(req.params.seq)
        .then((row) => {
            res.json(row);
        })
        .catch((errMsg) => {
            res.send(errMsg);
        });
});
app.post('/board/addBoardPro', (req, res) => {
    let board = {title:req.body.title, content:req.body.content, nickname:req.body.nickname};
    dbCon.addBoard(board)
    .then((msg) => {
        console.log(msg);
        res.send(msg);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });    
});

app.post('/board/boardUpdatePro', (req, res) => {
    let board = {seq:req.body.seq, title:req.body.title, content:req.body.content, nickname:req.body.nickname};
    console.log(board);
    dbCon.editBoard(board)
    .then((msg) => {
        console.log(msg);
        res.send(msg);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    }); 
});
app.get('/board/boardDelete/:seq', (req, res) => {
    let seq = req.params.seq;
    dbCon.delBoard(seq)
    .then((msg) => {
        console.log(msg);
        res.send(msg);
    })
    .catch((errMsg) => {
        console.log(msg);
    });
});
app.get('/member/list', (req, res) => {
    res.setHeader('Access-Control-Allow-origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // 쿠키 주고받기 허용
    dbCon2.getMemberList()
        .then((rows) => {
            res.json(rows);
        })
        .catch((errMsg) => {
            res.send(errMsg);
        });
});
app.get('/member/get/:id', (req, res) => {
    dbCon2.getMember(req.params.id)
        .then((row) => {
            res.json(row);
        })
        .catch((errMsg) => {
            res.send(errMsg);
        });
});
app.post('/member/addMemberPro', (req, res) => {
    let member = {id:req.body.id, pw:req.body.pw, name:req.body.name, email:req.body.email, tel:req.body.tel, addr1:req.body.addr1, addr2:req.body.addr2, postcode:req.body.postcode, regdate:req.body.regdate, birth:req.body.birth };
    dbCon2.addMember(member)
    .then((msg) => {
        console.log(msg);
        res.send(msg);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    });    
});

app.post('/member/memberUpdatePro', (req, res) => {
    let member = {id:req.body.id, pw:req.body.pw, name:req.body.name, tel:req.body.tel, addr1:req.body.addr1, addr2:req.body.addr2, postcode:req.body.postcode};
    console.log(member);
    dbCon2.editMember(member)
    .then((msg) => {
        console.log(msg);
        res.send(msg);
    })
    .catch((errMsg) => {
        console.log(errMsg);
    }); 
});
app.get('/member/memberDelete/:id', (req, res) => {
    let id = req.params.id;
    dbCon2.delMember(id)
    .then((msg) => {
        console.log(msg);
        res.send(msg);
    })
    .catch((errMsg) => {
        console.log(msg);
    });
});
let port = 4000;
app.listen(port, () => {
    console.log(`Sever Starting on ${port}`);
});