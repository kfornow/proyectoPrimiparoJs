const express =require('express');
const app = express();  // inicialisamos express
const session = require('express-session'); 
const connection =require('./conexion/conexion')
const ejs = require('ejs');


//recursos


app.use (express.urlencoded({extended:false}));
app.use (express.json());
app.use('/publico',express.static('public'));
app.use('/publico',express.static(__dirname + '/public'));



app.use(session({  // estas son las variables de seccion
    secret:'secret'  , // con esta podemos reservar la clave para que se a secreta
    resave:true , //esta es la forma es en la que se van a guardar las secciones
    saveUninitialized:true // y esta es la inicialisaccion 
}))

app.set('view engine','ejs'); // establesco el motor de plantillas
app.set('views',__dirname + '/views');


app.get('/', (req,res)=>{
    connection.query('select enfasis from selecciones',(error,results)=>{
        res.render('index',{results:results});
    })
})

// esta es para los mensajes
app.post('/mensajes', async (req,res)=>{
    let fecha = new Date();
    let hora = new Date();
    let nombre=req.body.nombre;
    let email =req.body.email;
    let telefono=req.body.telefono;
    let peticion =req.body.peticion;
    let enfasis =req.body.enfasis
    connection.query('INSERT INTO mensajes_cliente set?',{ nombre ,email , telefono ,peticion,fecha,hora,enfasis} ,async(error,results)=>{
        if(error){
            console.log(error)
        }
        else{
            res.redirect('/')
        }
    })
})



app.get('/login', (req,res)=>{
    res.render('login')
});

//para el login

app.post('/login',async(req,res)=>{ 
    let documento =req.body.documento;
    documento=parseInt(documento);
    let contraseña=req.body.contraseña;
    connection.query('select * from validacion WHERE documento = ?',[documento],async(error,results)=>{
        if(results ==0){
            res.redirect('/');
            
        }
        else if (results !=0){
            connection.query('select * from validacion WHERE contraseña = ?',[contraseña],async(error,results)=>{
                if(results ==0){  //si no esncuentra la contraseña ingresada me manda me dice contraseña incorrecta
                    res.redirect('/');
                }

                else if (results !=0) {  // si la contraseña coincide con la introducida  entonces me manda que si concide y me manda al crud
                    res.redirect('/crud')
                }

            })
        }
    });
});



// para el registro
app.get('/registro', (req,res)=>{
res.render('registro')
});

app.post('/registro',async (req ,res)=>{
    let documento =req.body.documento;
    documento=parseInt(documento);
    let contraseña=req.body.contraseña;
    connection.query('select * from validacion WHERE documento = ?',[documento],async(error,results)=>{
        if(results ==0){
            connection.query('INSERT INTO validacion set?',{ documento:documento ,contraseña:contraseña} ,async(error,results)=>{
                if(error){
                    console.log(error)
                }
                else{
                    res.send('usuario registrado correctamente')
                }
            })
        }
        else if (results !=0){
            res.send('el usuario ya esta registrado intentelo nuevamente')
        }
    });
});



app.get('/crud', (req,res)=>{
     // lo logre en esta parte solo lo puede traer una vez

    connection.query('select * from mensajes_cliente' , (error,results) =>{

        res.render('crud',{results,results})

    } )
    
})

app.get('/delete/:id_mensaje', (req, res) => {
    const id_mensaje = req.params.id_mensaje;
    connection.query('DELETE FROM mensajes_cliente WHERE id_mensaje = ?',[id_mensaje], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('/crud')  
        }
    })
});






app.listen(3000, (req,res)=>{
    console.log("esta conectado  http://localhost:3000");
});