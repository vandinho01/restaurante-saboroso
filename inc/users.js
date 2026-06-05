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
};
