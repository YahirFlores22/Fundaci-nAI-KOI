const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

// Crear conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'contraseña',
  database: 'nombre de la base' 
});

db.connect((err) => {
  if (err) {
    console.error('Error de conexión: ' + err.stack);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

// Ruta para obtener las estadísticas
app.get('/estadisticas', (req, res) => {
    let result = { sexo: {}, edad: {}, estado: {} };

    db.query('SELECT sexo, COUNT(*) AS count FROM ninos_etapa_terminal GROUP BY sexo', (err, ninos) => {
        if (err) throw err;
        result.sexo.ninosEtapaTerminal = ninos;

        db.query('SELECT sexo, COUNT(*) AS count FROM adultos_mayores GROUP BY sexo', (err, adultos) => {
            if (err) throw err;
            result.sexo.adultosMayores = adultos;

            db.query('SELECT sexo, COUNT(*) AS count FROM discapacidad GROUP BY sexo', (err, discapacitados) => {
                if (err) throw err;
                result.sexo.discapacidad = discapacitados;

                // Enviar los datos como respuesta en formato JSON
                res.json(result);
            });
        });
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
