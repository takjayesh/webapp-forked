
sleep 30

sudo apt-get update

sudo apt install unzip -y

# sudo apt install mysql-client -y
sudo groupadd csye6225
sudo useradd -s /bin/false -g csye6225 -d /opt/csye6225 -m csye6225
sudo mkdir /opt/csye6225/webapp
sudo mv /home/admin/webapp.zip /opt/csye6225/webapp/
cd /opt/csye6225/webapp/
sudo unzip webapp.zip
sudo apt install mysql-client -y
sudo apt install mariadb-server -y
# sudo npm audit fix
sudo apt-get install nodejs -y
sudo apt-get install npm -y
npm install
 
source_path="/opt/csye6225/webapp/opt/users.csv"
destination_path="/opt/"
 
# Move the file if it exists
[ -e "$source_path" ] && sudo mv "$source_path" "$destination_path" && echo "File 'users.csv' moved to '$destination_path'"
 
sudo mv /opt/csye6225/webapp/webapp.service /etc/systemd/system/webapp.service

sudo chown -R csye6225:csye6225 /opt/csye6225/webapp/
sudo chmod -R 750 /opt/csye6225/webapp/
sudo systemctl daemon-reload
sudo systemctl enable webapp
sudo systemctl start webapp



########################################################################################################

# sudo npm i pm2
# sudo npm i -g pm2
# sudo pm2 start server.js
# sudo pm2 startup systemd

# sudo apt-get clean


# cd ~/ && unzip webapp.zip
# cd ~/webapp
# sudo apt-get install nodejs -y
# sudo apt-get install npm -y
#  cd ~/webapp && npm i

# npm i

# sudo apt install mariadb-server -y
# sudo systemctl start mariadb 
# sudo systemctl enable mariadb 
#sudo mysql_secure_installation <<EOF
#mysql -u root
# sudo mysql <<EOF
# create database healthcheckdb;
# Alter USER 'root'@'localhost' IDENTIFIED BY 'admin';
# GRANT ALL PRIVILEGES ON healthcheckdb.* TO 'root'@'localhost' WITH GRANT OPTION;
# FLUSH PRIVILEGES;
# EOF

# echo "Starting mysql server"
# sudo service mysql start

# sudo npm i pm2
# sudo npm i -g pm2
# sudo pm2 start server.js
# sudo pm2 startup systemd

# sudo apt-get clean

