import mongoose from "mongoose";



const connection = async() => {

    try{

        mongoose.set('strictQuery', false); // Opción recomendada por Mongoose 7
        await mongoose.connect("mongodb://localhost:27017/mi_redsocial",
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true
        );

        console.log("Conectado correctamente a bd: mi_redsocial");

    } catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos !!");
    }

}

export default connection;
