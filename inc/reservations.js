var conn = require('./db');
var Pagination = require('./Pagination.js');


module.exports = {
  render(req, res, error, success) {
    res.render("reservations", {
      title: "Reservas - Restaurante Saboroso!",
      background: "images/img_bg_2.jpg",
      h1: "Reserve uma mesa!",
      body: req.fields || {},
      error,
      success,
    });
  },

  save(fields) {
    return new Promise((resolve, reject) => {
      //se for array, pega o primeiro elemento; se já for string, usa direto
      let date = Array.isArray(fields.date) ? fields.date[0] : fields.date;
      let name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      let email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      let people = Array.isArray(fields.people)
        ? fields.people[0]
        : fields.people;
      let time = Array.isArray(fields.time) ? fields.time[0] : fields.time;
      let id = Array.isArray(fields.id) ? fields.id[0] : fields.id;

      if (date && date.indexOf("/") > -1) {
        let parts = date.split("/");
        date = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }

      let query,
        params = [name, email, people, date, time];

      if (parseInt(id) > 0) {
        query = `UPDATE tb_reservations 
        SET 
          name = ?,
          email = ?,
          people = ?,
          date = ?,
          time = ?
        WHERE id = ?
          `;

        params.push(id);
      } else {
        query = `
        INSERT INTO tb_reservations (name, email, people, date, time)
        VALUES (?, ?, ?, ?, ?)
        `;
      }

      conn.query(query, params, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  getReservations(req) {
    return new Promise((resolve, reject) => {

      let page = req.query.page || 1;
      let dtstart = req.query.start;
      let dtend = req.query.end;

      let params = [];
      if (dtstart && dtend) params.push(dtstart, dtend);

      let pag = new Pagination(
        `SELECT SQL_CALC_FOUND_ROWS * 
             FROM tb_reservations 
             ${dtstart && dtend ? 'WHERE date BETWEEN ? AND ?' : ''}
             ORDER BY date DESC LIMIT ?, ?`,
        params
      );

      pag.getPage(page).then(data => {
        resolve({
          data,
          links: pag.getNavigation(req.query)
        });
      }).catch(reject);

    });
  },

  delete(id) {
    return new Promise((resolve, reject) => {
      conn.query(
        `
        DELETE FROM tb_reservations WHERE id = ?
      `,
        [id],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        },
      );
    });
  },
};