
CREATE USER 'bot'@'localhost' IDENTIFIED BY 'ledonjon';
GRANT ALL PRIVILEGES ON *.* TO 'bot'@'localhost';
FLUSH PRIVILEGES;