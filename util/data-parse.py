import mysql.connector

#######
# To only be run on empty tables
# Scrit would need to be adapted for existing entries to avoid duplicates
#######

fileName = "Rumney-Routes-test.csv"
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

## Loop through each line of the file until end of file
while dat != "":    
    ## Columns we want are (Route, Location, AVG Stars, Route Type, Difficulty, Length, Area Latitude, Area Longitude)
    ## Split by comma and grab the values we want
    dat = dat.split(',')
    routeName = dat[0]
    location = dat[1]
    avgStars = dat[3]
    ## Sometimes route type is more than one, seperated by a comma, split will not handle this right
    offset = 0
    routeType = dat[5]
    if routeType[0] == '\"':
        while routeType[len(routeType) - 1] != '\"':
            offset += 1
            routeType += ", " + dat[5 + offset]
    routeType = routeType.trim('\"')
    difficulty = dat[6 + offset].trim('\"')
    routeLength = dat[8 + offset]
    areaLat = dat[9 + offset]
    areaLong = dat[10 + offset]
    
    ## If route length is not null, convert to an int
    if routeLength != '':
        routeLength = int(routeLength)
    else: 
        routeLength = None

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
    routeData = (routeName, avgStars, routeType, difficulty, routeLength, locId)
    cursor.execute(addRoute, routeData)

    ## Read in the next line
    dat = file.readline()

print(dat)

file.close()
cnx.commit()
cursor.close()
cnx.close()