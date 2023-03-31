// imports

const body_parser = require('body-parser');
const express = require('express');
const http_status = require('http-status');
const path = require('path');
const relations = require('./relations');
const connection = require('./config/sequelize');
const { TokenExpiredError, JsonWebTokenError } = require('jsonwebtoken');

const app = express();

// middlewares

app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());
app.use(express.urlencoded({ extended:true }));

// to allow all clients with diffrent domain names to use the Api

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', '*') // allow diffrent domain names
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,PATCH,PUT') // allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization') // allowed headers
    next()
});

// error handler
// all the errors passed to the next function must 
// have the tow proprities status & message

const errorHandler = (err,req,res,next) => {
    console.log(err)
    const status = err.status || http_status.INTERNAL_SERVER_ERROR;
    res.status(status).json({
        message: err.message,
        status: err.status
    });
};

// routers

const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const sdsRouter = require('./routes/sds');
const comiteRouter = require('./routes/comite');
const incubateurRouter = require('./routes/incubateur');
const encadreurRouter = require('./routes/encadreur');
const Compte = require('./models/compte');

app.use('/v1/auth/', authRouter);
app.use('/v1/admin/', adminRouter);
app.use('/v1/sds', sdsRouter);
app.use('/v1/comite', comiteRouter);
app.use('/v1/incubateur', incubateurRouter);
app.use('/v1/encadreurs', encadreurRouter);

app.get('/', async (req,res,next) => {
    const compte = await Compte.findByPk(13);
    res.status(200).json('hello');
});

// use the error handler

app.use(errorHandler);

async function main() {
    try {
        await connection.authenticate();
        app.listen(8080, () => console.log('connected'));
        /*await connection.query(`
            CREATE OR REPLACE VIEW users as
            select comptes.idCompte,email,photo,numeroTelephone,estActive,
                    comptes.createdAt,comptes.updatedAt,nom,prénom,
                    dateDeNaissance,lieuDeNaissance,etablissement,sexe,
                    (SELECT GROUP_CONCAT(intitule SEPARATOR ',' )
                    FROM compte_roles,roles
                    WHERE compte_roles.idCompte=comptes.idCompte AND roles.idRole=compte_roles.idRole) AS roles
            FROM utilisateurs,comptes
            WHERE utilisateurs.idCompte=comptes.idCompte
                UNION
            SELECT comptes.idCompte,email,photo,numeroTelephone,estActive,
                    comptes.createdAt,comptes.updatedAt,nom,prénom,
                    dateDeNaissance,lieuDeNaissance,etablissement,sexe,
                    'ETUDIANT' AS roles
            FROM membres_de_projets,comptes
            WHERE membres_de_projets.idCompte=comptes.idCompte;
        `);*/
    } catch(err) {
        console.log(err);
    }
}

main();