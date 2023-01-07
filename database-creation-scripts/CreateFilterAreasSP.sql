-- Active: 1672518843966@@127.0.0.1@3306@climbingroutes

CREATE PROCEDURE filterAreas(stars INT, minDiff INT, maxDiff INT, showTrad BOOL, showSport BOOL, showTR BOOL)
BEGIN

    CREATE TEMPORARY TABLE loc_tbl 
        SELECT `LocationId` FROM climbingroute cr
        WHERE 
        cr.`AvgStars` >= stars 
        AND cr.`Difficulty` >= minDiff
        AND cr.`Difficulty` <= maxDiff
        AND (
            (showTrad AND cr.`RouteType` LIKE BINARY '%Trad%')
            OR (showSport AND cr.`RouteType` LIKE BINARY '%Sport%')
            OR (showTR AND cr.`RouteType` LIKE BINARY '%TR%')
        )
        GROUP BY `LocationId`;         

    SELECT `Id`, `Name`, `Latitude`, `Longitude`, `RawAreaPath` FROM climbingarea
    INNER JOIN loc_tbl lt on lt.LocationId = `Id`;

    DROP Table loc_tbl;
END;