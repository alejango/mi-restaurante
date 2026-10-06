const bcrypt = require('bcrypt');

const password = process.env.ADMIN_PASSWORD;
if (!password) {
    throw new Error('Define ADMIN_PASSWORD con la contraseña que quieras convertir en hash.');
}
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
    if (err) {
        console.error("Error generando hash:", err);
        return;
    }

    console.log("HASH generado:");
    console.log(hash);
});
