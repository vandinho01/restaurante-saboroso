let conn = require("./db");
let path = require('path');

module.exports = {
  getMenus() {
    return new Promise((resolve, reject) => {
      conn.query(
        `
        SELECT * FROM tb_menus ORDER BY title
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

      let photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;
      fields.photo = `images/${path.parse(photo.filepath || photo.path).base}`;

      let title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      let description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      let price = Array.isArray(fields.price) ? fields.price[0] : fields.price;

      conn.query(
        `INSERT INTO tb_menus (title, description, price, photo) VALUES(?, ?, ?, ?)`,
        [title, description, price, fields.photo],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
};
