const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cron = require('node-cron')

const homeRouter = require('./routes/homeRouter')
const loginRouter = require('./routes/loginRouter')
const registerRouter = require('./routes/registerRouter')
const inventoryRouter = require('./routes/inventoryRouter')
const adminRouter = require('./routes/adminRouter')

const notice = require('./resources/notice')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('views'))

app.use(session({
  secret: '3a80d6d355683891d59203e4aef59b04cd55d5f52159bfa64061001b554ac035',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(homeRouter)
app.use(loginRouter)
app.use(registerRouter)
app.use(inventoryRouter)
app.use(adminRouter)

setInterval(notice.checkAndSendEmail, 6 * 60 * 60 * 1000)

cron.schedule('0 9 * * 1', () => { notice.checkStockAndSendEmail() }, { timezone: 'America/Sao_Paulo' })

app.listen(3000, () => {
  console.log(`Servidor rodando em http://localhost:${3000}`)
})