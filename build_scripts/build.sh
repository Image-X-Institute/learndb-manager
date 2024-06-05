

cd ..
yarn build

# Copy the build to the server
sudo cp -r dist/* /var/www/learndbmanager/

# Restart the server
sudo systemctl restart nginx