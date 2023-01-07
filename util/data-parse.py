import mysql.connector

#######
# To only be run on empty tables
# Scrit would need to be adapted for existing entries to avoid duplicates
#######

## File is deliniated by tabs, sometimes route names have commas in it, and it makes data processing a bit messy
fileName = "Rumney-Routes-All.td"
filePath = "raw-data\\"
## Open the file for reading each line
file = open(filePath + fileName, 'r')

## Read the first line to get the col names
dat = file.readline()
columnNames = dat

dat = file.readline()

passFile = open("./util/database-creds.txt")
user, password = passFile.readline().split(":")
passFile.close()

cnx = mysql.connector.connect(user=user, password=password, host='127.0.0.1', database='climbingroutes')
cursor = cnx.cursor()
addArea = (
    "INSERT INTO climbingarea (Name, Latitude, Longitude, RawAreaPath)"
    "VALUES (%s, %s, %s, %s)"
)
addRoute = (
    "INSERT INTO climbingroute (Name, AvgStars, RouteType, Difficulty, Length, LocationId)"
    "VALUES (%s, %s, %s, %s, %s, %s)"
)

areaDic = {}
difficulties = ["3rd", "4th", "5", "5.1", "5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", "5.10",
     "5.10c", "5.10d", "5.11a", "5.11b", "5.11", "5.11c", "5.11d", "5.12a", "5.12b", "5.12", "5.12c", "5.12d", "5.13a", "5.13b",
     "5.13", "5.13c", "5.13d", "5.14a", "5.14b", "5.14", "5.14c", "5.14d", "5.15a", "5.15b", "5.15", "5.15c", "5.15d"]

## Loop through each line of the file until end of file
while dat != "":    
    ## Columns we want are (Route, Location, AVG Stars, Route Type, Difficulty, Length, Area Latitude, Area Longitude)
    ## Split by comma and grab the values we want
    dat = dat.split('\t')
    routeName = dat[0].strip('\"')
    location = dat[1].strip('\"')
    avgStars = dat[3].strip('\"')
    routeType = dat[5]
    routeType = routeType.strip('\"')
    difficulty = dat[6].strip('\"')
    routeLength = dat[8]
    areaLat = dat[9]
    areaLong = dat[10]
    
    ## Process Difficulty to standardize them -> Remove extra info (PG13), take lower rating for things like a/b or c/d and Plus or Minus
    difficulty = difficulty.split(" ")[0].split("/")[0].strip("+").strip("-")
    ## Convert it to a number to be used like an enum
    diffNumber = difficulties.index(difficulty)

    ## Only keep Sport, Trad and TopRope (TR) routes
    if(',' in routeType):
        types = ""
        for route in routeType.split(', '):
            if route in ["Sport", "Trad", "TR"]:
                types += (route if types == "" else ", " + route)
        routeType = types

    ## If route length is not null, convert to an int
    if routeLength != '':
        routeLength = int(routeLength)
    else: 
        routeLength = None

    try: 
        ## Location ID used to link a route to a location
        locationSplit = location.split(" > ")
        loc = locationSplit[0]
        locId = 0
        if loc not in areaDic.keys():
            cursor.execute(addArea, (loc, areaLat, areaLong, location))
            locId = cursor.lastrowid
            areaDic[loc] = locId
        else:
            locId = areaDic[loc]

        ## Insert the data into a new entry of the MySQL database
        routeData = (routeName, avgStars, routeType, diffNumber, routeLength, locId)
        cursor.execute(addRoute, routeData)
    except: 
        print("Error occured with data line: ", dat)

    ## Read in the next line
    dat = file.readline()

print(dat)

file.close()
cnx.commit()
cursor.close()
cnx.close()