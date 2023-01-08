-- Active: 1672518843966@@127.0.0.1@3306@climbingroutes

CREATE PROCEDURE FILTERROUTES(LOCID INT, STARS INT, 
MINDIFF INT, MAXDIFF INT, SHOWTRAD BOOL, SHOWSPORT 
BOOL, SHOWTR BOOL) BEGIN 
	SELECT *
	FROM climbingroute cr
	WHERE
	    cr.`LocationId` = locId
	    AND cr.`AvgStars` >= stars
	    AND cr.`Difficulty` >= minDiff
	    AND cr.`Difficulty` <= maxDiff
	    AND ( (
	            showTrad
	            AND cr.`RouteType` LIKE BINARY '%Trad%'
	        )
	        OR (
	            showSport
	            AND cr.`RouteType` LIKE BINARY '%Sport%'
	        )
	        OR (
	            showTR
	            AND cr.`RouteType` LIKE BINARY '%TR%'
	        )
	    )
	ORDER BY `Difficulty`;
END; 