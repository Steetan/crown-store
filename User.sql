CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  name_user VARCHAR(255),
  fname_user VARCHAR(255),
  oname_user VARCHAR(255),
  username VARCHAR(255),
  password VARCHAR(255),
  phone_number INTEGER
);

CREATE TABLE admins (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

INSERT INTO users (id, name_user, fname_user, oname_user, username, password, phone_number) 
VALUES ('1', 'Иван', 'Иванов', 'Иванович', 'ivan123', 'qwerty', 1234567890);