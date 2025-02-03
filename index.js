import express from 'express';
import 'dotenv/config';




const port =process.env.PORT || 3020;
const app = express();

app.use(express.json());

app.listen(port, () => {
    console.log(`El servidor esta corriendo en el puerto ${port}`);
  });


  export default app;


