// Run Azure SQL schema
const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function runSchema() {
  console.log('Connecting to Azure SQL...');
  console.log('Server:', config.server);
  console.log('Database:', config.database);

  try {
    await sql.connect(config);
    console.log('Connected successfully!');

    // Read schema file
    const schemaPath = path.join(__dirname, 'azure_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split into batches (GO statements are not valid in mssql package)
    // Execute as a single batch since we don't have GO statements
    console.log('Running schema...');
    await sql.query(schema);
    console.log('Schema created successfully!');

    // Verify tables
    const result = await sql.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `);

    console.log('\nCreated tables:');
    result.recordset.forEach(row => console.log('  -', row.TABLE_NAME));

    await sql.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

runSchema();
