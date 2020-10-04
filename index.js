const express = require('express')
const app = express()
const port = 6000
const bodyParser = require('body-parser'); //bodyParser 을 이용하기위해 가져오자.
const cookieParser = require('cookie-parser');
const { User } = require("./models/User"); //post를 이용한 데이터데이스를 가져올 떄 아까 만들어 놓은 스키마를 이용할 필요가 있다.
const config = require("./config/key");


//body-parser에 옵션 주기
// 1. application/x-www-form-urlencoded 형태의 데이터 를 가져와서 분석할 수 있게끔
app.use(bodyParser.urlencoded({extended: true}));
// 2. application/json 형태의 데이터를 가져와서 분석할 수 있게끔.
app.use(bodyParser.json());
app.use(cookieParser());


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

app.post('/login', (req, res) => {

  // console.log('ping')
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {

    // console.log('user', user)
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }

    //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      // console.log('err',err)

      // console.log('isMatch',isMatch)

      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })


      //비밀번호 까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다.  어디에 ?  쿠키 , 로컳스토리지 (여기서는 쿠키에 저장
        // 쿠키에 저장하기 위해서는 라이브러리를 깔아야함. express에서 제공하는 cookie-parser 
        res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
