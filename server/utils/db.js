const { Pool } = require('pg');
require('dotenv').config();
const db=new Pool({
    user:process.env.SUPABASE_SERVICE_ROLE,
    password:process.env.SUPABASE_SERVICE_PASSWORD,
    host:process.env.SUPABASE_SERVICE_HOST,
    port:process.env.SUPABASE_SERVICE_PORT,
    database:process.env.SUPABASE_SERVICE_DB,
});
module.exports=db;