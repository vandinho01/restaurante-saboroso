var conn = require("./db");

module.exports = {
  render(req, res, error) {
    res.render("admin/login", {
      body: req.fields || {},
      error,
    });
  },

  login(email, password) {
    email = Array.isArray(email) ? email[0] : email;
    password = Array.isArray(password) ? password[0] : password;

    return new Promise((resolve, reject) => {
      conn.query(
        `SELECT * FROM tb_users WHERE email = ?`,
        [email],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            if (!results.length > 0) {
              reject("Usuário ou senha incorretos");
            } else {
              let row = results[0];
              if (row.password !== password) {
                reject("Usuário ou senha incorretos");
              } else {
                resolve(row);
              }
            }
          }
        },
      );
    });
  },

  getUsers() {
    return new Promise((resolve, reject) => {
      conn.query(
        `
        SELECT * FROM tb_users ORDER BY name
        `,
        (err, results) => {
          if (err) {
            reject(err);
          }

          resolve(results);
        },
      );
    });
  },

  save(fields, files) {
    return new Promise((resolve, reject) => {

      let query, queryPhoto = '', params = [
        fields.name,
        fields.email,
      ];

      if (parseInt(id) > 0) {

        params.push(id);

        query = `
        UPDATE tb_users
        SET name = ?,
            email = ?
        WHERE id = ?
    `;

      } else {

        query = `
        INSERT INTO tb_users (name, email, password)
        VALUES(?, ?, ?)
    `;
        params.push(fields.password);

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

  delete(id) {

    return new Promise((resolve, reject) => {

      conn.query(`
        DELETE FROM tb_users WHERE id = ?
      `,
        [id], (err, results) => {

          if (err) {
            reject(err);
          } else {
            resolve(results);
          }

        })

    })

  },

  changePassword(req) {
    return new Promise((resolve, reject) => {

      // Normaliza os campos — formidable v3+ retorna arrays, então pega o primeiro elemento se for array
      let password = Array.isArray(req.fields.password) ? req.fields.password[0] : req.fields.password;
      let passwordConfirm = Array.isArray(req.fields.passwordConfirm) ? req.fields.passwordConfirm[0] : req.fields.passwordConfirm;
      let id = Array.isArray(req.fields.id) ? req.fields.id[0] : req.fields.id;

      if (!password) {
        reject('Preencha a senha');
      } else if (password !== passwordConfirm) {
        reject('Confirme a senha corretamente');
      } else {

        conn.query(`
                UPDATE tb_users
                SET password = ?
                WHERE id = ?
            `, [password, id], (err, results) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(results);
          }
        });
      }
    });
  }

};
