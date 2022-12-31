
fileName = "Rumney-Routes-test.csv"
filePath = "raw-data\\"
## Open the file for reading each line
file = open(filePath + fileName, 'r')

## Read the first line to get the col names
dat = file.readline()
columnNames = dat

dat = file.readline()
## Loop through each line of the file until end of file
while dat != "":
    ## Columns we want are (Route, Location, AVG Stars, Route Type, Difficulty, Length, Area Latitude, Area Longitude)
    ## Split by comma and grab the values we want
    dat = dat.split(',')
    routeName = dat[0]
    location = dat[1]
    avgStars = dat[3]
    routeType = dat[5]
    difficulty = dat[6]
    routeLength = dat[8]
    areaLat = dat[9]
    areaLong = dat[10]
    
    ## Location ID used to link a route to a location
    locationSplit = location.split(" > ")
    print(location)

    ## Insert the data into a new entry of the MySQL database
    sqlInsertStatement = "INSERT INTO Routes (Route, Location, AvgStars, RouteType, Lenght, AreaLatitude, AreaLongitude) + Values("
    sqlInsertStatement += "'" + routeName +  "', " 
    sqlInsertStatement += "IDK" ## Need to forigen key this

    ## Read in the next line
    dat = file.readline()

print(dat)

file.close()