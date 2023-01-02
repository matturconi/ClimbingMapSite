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
        routeData = (routeName, avgStars, routeType, difficulty, routeLength, locId)
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