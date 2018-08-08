const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

let username;
let birthday;

// CORREÇÕES:

// Não preciso usar essas LET no início, basta usar a req.query
// Usar mais desestruturação
// Lembrar que tenho req.body e também o req.query
// Posso substituir o bodyParser pelo Express no app.use()
// Poderia também passar o birthDate por URL
// O middleware de checagem poderia checar nome e data
// Quando o ESLint aceitar, usar ternárias

// Ao invés de:
// const DATA_NASCIMENTO = moment(birthday).format('DD/MM/YYYY');
// const idade = moment().diff(moment(DATA_NASCIMENTO, 'DD/MM/YYYY'), 'years');
// Poderia ser apenas:
// const idade = moment().diff(birthDate, 'years', true);

// Se o middleware de checagem estiver verificando nome e data,
// as rotas major e minor não precisam verificar nada

// CONFIGURAÇÕES /////////////////////////////////////
const app = express();
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

// ROTAS /////////////////////////////////////////////
app.get('/', (req, res) => {
  res.render('main');
});
// ***************************************************
app.post('/check', (req, res) => {
  username = req.body.user;
  birthday = req.body.birthDate;

  const DATA_NASCIMENTO = moment(birthday).format('DD/MM/YYYY');
  const idade = moment().diff(moment(DATA_NASCIMENTO, 'DD/MM/YYYY'), 'years');

  if (idade) {
    if (idade >= 18) {
      res.redirect(`/major?nome=${username}`);
    } else {
      res.redirect(`/minor?nome=${username}`);
    }
  } else {
    res.redirect('/');
  }
});
// ***************************************************
const checkName = (req, res, next) => {
  if (req.query.nome) {
    next();
  } else {
    res.redirect('/');
  }
};
// ***************************************************
app.get('/major', checkName, (req, res) => {
  if (username) {
    res.render('major', { username });
    username = null;
  } else {
    res.redirect('/');
  }
});
// ***************************************************
app.get('/minor', checkName, (req, res) => {
  if (username) {
    res.render('minor', { username });
    username = null;
  } else {
    res.redirect('/');
  }
});
// ***************************************************
app.listen(3000);
