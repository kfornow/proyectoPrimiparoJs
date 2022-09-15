const mysql =require('mysql');
const connection =mysql.createConnection({
host:'bkjmeqdvayi74skna739-mysql.services.clever-cloud.com',
user:'uthzct08adtyk2nj',
password:'b83BcAVeZwc2D9HspO4n',
database:'bkjmeqdvayi74skna739'
    });

connection.connect((error )=>{
    if (error){
        console.error('conexion erronea')
        return;
    }
    console.log('estas conectado corractamente xdxd');
});

module.exports =  connection      // el module.exports nos sirve para llamar en otro archivo del cualquier parte del proyecto nustro