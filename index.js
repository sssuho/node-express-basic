const express = require('express')
const app = express()
const port = 6000
const bodyParser = require('body-parser'); //bodyParser 을 이용하기위해 가져오자.
const { User } = require("./models/User"); //post를 이용한 데이터데이스를 가져올 떄 아까 만들어 놓은 스키마를 이용할 필요가 있다.
const config = require("./config/key");


//body-parser에 옵션 주기
// 1. application/x-www-form-urlencoded 형태의 데이터 를 가져와서 분석할 수 있게끔
app.use(bodyParser.urlencoded({extended: true}));
// 2. application/json 형태의 데이터를 가져와서 분석할 수 있게끔.
app.use(bodyParser.json());


const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,
 {useNewUrlParser:true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false
}).then(() => console.log(`MongoDB Connected...`))
.catch(err => console.log(err));



app.get('/', (req, res) => {
  res.send('Hello World!')
})

//회원가입을 위한 라우터 만들기
app.post('/register', (req,res) => {
//회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.

    //bodyParser 가 보내주는 역할 하는것임.
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err})
        return res.status(200).json({ success: true
        })
    })
})

app.get('/', (req,res) => res.send('Hello. nodeJS'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
