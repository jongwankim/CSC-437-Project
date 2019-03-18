create table Person (
  id int auto_increment primary key,
  firstName varchar(30),
  lastName varchar(30) not null,
  email varchar(30) not null,
  password varchar(50),
  whenRegistered datetime not null,
  termsAccepted datetime,
  role int unsigned not null,  # 0 normal, 1 admin
  unique key(email)
);

create table Inventory (
  id int auto_increment primary key,
  itemName varchar(80) not null,
  quantity int not null,
  unique key UK_name(itemName)
);

create table CheckedItem (
  id int auto_increment primary key,
  invtId int not null,
  firstName varchar(30),
  lastName varchar(30) not null,
  email varchar(30) not null,
  whenChecked datetime not null,
  
  constraint FKCheckedItem_invtId foreign key (invtId) references Inventory(id)
    on delete cascade
);

insert into Person (firstName, lastName, email,       password,   whenRegistered, role)
            VALUES ("Joe",     "Admin", "adm@11.com", "password", NOW(), 1);