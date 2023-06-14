if [ ! -d "/app/node_modules" ]; then
	npm install
fi
if [ ! -d "/app/dist" ]; then
	npm run build
fi
npm run start:dev