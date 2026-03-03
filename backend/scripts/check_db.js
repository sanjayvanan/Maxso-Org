require('dotenv').config({ path: '../.env' });
const db = require('../db');
const fs = require('fs');

async function check() {
    try {
        const res = await db.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' AND table_name IN ('User', 'Transaction', 'LevelConfig', 'Referral')
            ORDER BY table_name, ordinal_position;
        `);

        const dataRes = await db.query('SELECT * FROM "LevelConfig" ORDER BY level ASC;');

        fs.writeFileSync('schema_dump.json', JSON.stringify({
            schema: res.rows,
            levelConfigs: dataRes.rows
        }, null, 2));
        console.log("Dumped to schema_dump.json");
    } catch (err) {
        console.error("DB Error:", err);
    }
    process.exit();
}
check();
