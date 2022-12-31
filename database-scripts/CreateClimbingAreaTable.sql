-- Active: 1672518843966@@127.0.0.1@3306@climbingroutes

CREATE TABLE IF NOT EXISTS ClimbingArea(  
    Id          INT             NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Name        VARCHAR(256)    NOT NULL,
    Latitude    DECIMAL         NOT NULL,
    Longitude   DECIMAL         NOT NULL,
    RawAreaPath VARCHAR(1024)    NOT NULL
);