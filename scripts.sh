#!/bin/bash

sleep 30

sudo apt-get update
#sudo apt-get upgrade -y
#sudo apt-get install nginx -y #not required

#sudo mkdir webapp
 sudo apt install unzip -y
 cd ~/ && unzip webapp.zip
 cd ~/webapp
#sudo curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh
#sudo bash nodesource_setup.sh
sudo apt-get install nodejs -y
sudo apt-get install npm -y
 cd ~/webapp && npm i


npm i

sudo apt install mariadb-server -y
sudo systemctl start mariadb 
sudo systemctl enable mariadb 
#sudo mysql_secure_installation <<EOF
#mysql -u root
sudo mysql <<EOF
create database healthcheckdb;
Alter USER 'root'@'localhost' IDENTIFIED BY 'admin';
GRANT ALL PRIVILEGES ON healthcheckdb.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

echo "Starting mysql server"
sudo service mysql start

sudo npm i pm2
sudo npm i -g pm2
sudo pm2 start server.js
sudo pm2 startup systemd

sudo apt-get clean