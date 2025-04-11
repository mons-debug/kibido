console.log('Script starting...');

const fs = require('fs');
const path = require('path');

try {
  console.log('Checking for CSV file...');
  const csvFilePath = path.join(process.cwd(), 'products.csv');
  console.log(`Looking for CSV file at: ${csvFilePath}`);
  
  if (fs.existsSync(csvFilePath)) {
    console.log('CSV file found!');
    const stat = fs.statSync(csvFilePath);
    console.log(`File size: ${stat.size} bytes`);
    
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    console.log(`First 100 characters: ${csvData.substring(0, 100)}`);
  } else {
    console.log('CSV file not found');
    console.log('Current directory contents:');
    const files = fs.readdirSync(process.cwd());
    console.log(files.join('\n'));
  }
} catch (error) {
  console.error('Error:', error);
} 