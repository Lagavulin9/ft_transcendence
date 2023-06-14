if [ ! -d "/app/node_modules" ]; then
	npm install
fi
if [ ! -d "/app/.next" ]; then
	npm run build
fi
npm run dev