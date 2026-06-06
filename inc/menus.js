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

      let id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
      let title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      let description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
      let price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
      

      let photo = files.photo ? (Array.isArray(files.photo) ? files.photo[0] : files.photo) : null;
      let photoPath = photo && photo.size > 0
        ? `images/${path.parse(photo.filepath || photo.path).base}`
        : null;

      let query, params;

      if (parseInt(id) > 0) {
        if (photoPath) {
          query = `UPDATE tb_menus SET title=?, description=?, price=?, photo=? WHERE id=?`;
          params = [title, description, price, photoPath, id];
        } else {
          query = `UPDATE tb_menus SET title=?, description=?, price=? WHERE id=?`;
          params = [title, description, price, id];
        }

      } else {
        if (!photoPath) {
          return reject('Envie a foto do prato');
        }
        query = `INSERT INTO tb_menus (title, description, price, photo) VALUES(?, ?, ?, ?)`;
        params = [title, description, price, photoPath];
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

  delete(id){

    return new Promise((resolve, reject)=>{

      conn.query( `
        DELETE FROM tb_menus WHERE id = ?
      `,
      [id], (err, results)=>{

        if(err){
          reject(err);
        } else {
          resolve(results);
        }

      })

    })

  }

};
