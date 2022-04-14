import mongoose from 'mongoose';
const conectarDB = async () => {
  try {
    const urlConnection = process.env.URL_CONNECTION_MONGOOSE;
    const connection = await mongoose.connect(urlConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${connection.connection.host}:${connection.connection.port}`;
    console.log(`MONGODB CONECTADO EN ${url}`);
  } catch (error) {
    console.log(`error:${error.message}`);
    process.exit(1);
  }
};
export default conectarDB;
