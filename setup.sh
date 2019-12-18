echo "Copying .env.example to .env"
cp .env.example .env
echo "Copying ./.env.example to ./.env"
cp ./.env.example ./.env
echo "Running npm clean install"
npm ci
echo "SETUP FINISHED"