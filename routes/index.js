var conn = require('./../inc/db')
var express = require('express');
var menus = require('./../inc/menus');
var reservations = require('./../inc/reservations');
const contacts = require('./../inc/contacts');
var emails = require('./../inc/emails');
var nodemailer = require('nodemailer');
var router = express.Router();

module.exports = function (io) {

  /* GET home page. */
  router.get('/', function (req, res, next) {

    menus.getMenus().then(results => {
      res.render('index', {
        title: 'Restaurante Saboroso!',
        menus: results,
        isHome: true
      });
    });
  });

  router.get('/contacts', function (req, res, next) {

    contacts.render(req, res);

  });

  router.post('/contacts', function (req, res, next) {

    if (!req.body.name) {
      contacts.render(req, res, 'Digite o nome');
    } else if (!req.body.email) {
      contacts.render(req, res, 'Digite o Email');
    } else if (!req.body.message) {
      contacts.render(req, res, 'Digite o mensagem');
    } else {
      contacts.save(req.body).then(results => {
        io.emit('dashboard update');
        contacts.render(req, res, null, 'Contato enviado com Sucesso!');
      }).catch(err => {
        req.body = {}
        contacts.render(req, res, err, err.message);
      });
    }

  });

  router.get('/menus', function (req, res, next) {

    menus.getMenus().then(results => {

      res.render('menus', {
        title: 'Menus - Restaurante Saboroso!',
        background: 'images/img_bg_1.jpg',
        h1: 'Saboreie nosso menu!',
        menus: results
      });

    });

  });

  router.get('/reservations', function (req, res, next) {

    reservations.render(req, res);

  });

  router.post('/reservations', async function (req, res, next) {

    if (!req.body.name) {
      reservations.render(req, res, 'Digite o nome');
    } else if (!req.body.email) {
      reservations.render(req, res, 'Digite o Email');
    } else if (!req.body.people) {
      reservations.render(req, res, 'Selecione o número de pessoas');
    } else if (!req.body.date) {
      reservations.render(req, res, 'Selecione a data');
    } else if (!req.body.time) {
      reservations.render(req, res, 'Selecione a hora');
    } else {
      reservations.save(req.body).then(async results => {

        try {
          const accountSid = process.env.TWILIO_ACCOUNT_SID;
          const authToken = process.env.TWILIO_AUTH_TOKEN;

          const content =
            `✅ *Nova Reserva - Restaurante Saboroso!*\n\n` +
            `👤 Nome: ${req.body.name}\n` +
            `📧 E-mail: ${req.body.email}\n` +
            `👥 Pessoas: ${req.body.people}\n` +
            `📅 Data: ${req.body.date}\n` +
            `🕐 Hora: ${req.body.time}\n` +
            `Te esperamos em breve!`

          const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + btoa(`${accountSid}:${authToken}`)
            },
            body: new URLSearchParams({
              To: process.env.TWILIO_WHATSAPP_TO,
              From: process.env.TWILIO_WHATSAPP_FROM,
              Body: content
            })
          });

          const data = await response.json();
          console.log('[TWILIO RESPONSE]', response.status, JSON.stringify(data));

        } catch (err) {
          console.log('[ERRO Twilio]', err);
        }

        // Envia e-mail de confirmação via Nodemailer
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS
            }
          });

          await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: req.body.email,
            subject: 'Confirmação de Reserva - Restaurante Saboroso!',
            html: `
              <h2>✅ Reserva Confirmada!</h2>
              <p>Olá, <strong>${req.body.name}</strong>! Sua reserva foi confirmada com sucesso.</p>
              <h3>Detalhes:</h3>
              <ul>
                <li><strong>Nome:</strong> ${req.body.name}</li>
                <li><strong>E-mail:</strong> ${req.body.email}</li>
                <li><strong>Pessoas:</strong> ${req.body.people}</li>
                <li><strong>Data:</strong> ${req.body.date}</li>
                <li><strong>Hora:</strong> ${req.body.time}</li>
              </ul>
              <p>Aguardamos você!</p>
            `
          });

          console.log('[EMAIL] Confirmação enviada para', req.body.email);

        } catch (err) {
          console.log('[ERRO Email]', err);
        }


        req.body = {};
        io.emit('dashboard update');
        reservations.render(req, res, null, "Reserva realizada com sucesso!");

      }).catch(err => {
        reservations.render(req, res, err.message);
      });
    }

  });

  router.get('/services', function (req, res, next) {
    res.render('services', {
      title: 'Serviços - Restaurante Saboroso!',
      background: 'images/img_bg_1.jpg',
      h1: 'É um prazer poder servir!'
    });
  });

  router.post('/subscribe', function (req, res, next) {

    emails.save(req).then(results => {
      res.json(results);
    }).catch(err => {
      res.json(err);
    });

  });
  return router;
};
