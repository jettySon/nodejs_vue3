// server/setup.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure the prisma directory exists
const prismaDir = path.join(__dirname, 'prisma');
if (!fs.existsSync(prismaDir)) {
	fs.mkdirSync(prismaDir);
}

// Copy schema.prisma file if it doesn't exist (in case you're running this script directly)
const schemaPath = path.join(prismaDir, 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
	console.log('Creating Prisma schema file...');
	// You would need to copy the schema content here if necessary
}

try {
	// Generate Prisma client
	console.log('Generating Prisma client...');
	execSync('npx prisma generate', { stdio: 'inherit' });
	
	// Run migrations
	console.log('Running database migrations...');
	execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
	
	console.log('✅ Database setup complete!');
} catch (error) {
	console.error('❌ Error setting up database:', error.message);
	process.exit(1);
}