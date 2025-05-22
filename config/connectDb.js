import {neon} from '@neondatabase/serverless';
import {config} from 'dotenv';

config();
const sql = neon(process.env.DATABASE_CONNECTION_STRING);

const connectDb = async() => {
    try{
        const result = await sql `SELECT version()`;
        const version = result[0].version;
        console.log(`Database connected successfully in version ${version}`)
    }
    catch(error){
        console.log(error.message);
    }
}

export   {connectDb , sql};