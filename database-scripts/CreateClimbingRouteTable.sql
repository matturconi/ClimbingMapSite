-- Active: 1672518843966@@127.0.0.1@3306@climbingroutes

CREATE TABLE IF NOT EXISTS ClimbingRoute(  
    Id          INT             NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Name        VARCHAR(256)    NOT NULL,
    AvgStars    DECIMAL         NOT NULL,
    RouteType   VARCHAR(16)     NOT NULL,       
    Difficulty  VARCHAR(16)     NOT NULL,
    Length      INT             NULL,
    LocationId  INT             NOT NULL,
    CONSTRAINT FK_ClimbingRoute_LocationId FOREIGN KEY (LocationId) REFERENCES ClimbingArea(Id)
);
