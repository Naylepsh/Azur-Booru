$mongod = 'mongod'
$args1 = '--replSet rs0 --port 27017 --bind_ip localhost --dbpath ./data/rs1  --oplogSize 128'
$args2 = '--replSet rs0 --port 27018 --bind_ip localhost --dbpath ./data/rs2  --oplogSize 128'
$args3 = '--replSet rs0 --port 27019 --bind_ip localhost --dbpath ./data/rs3  --oplogSize 128'
$mongo = 'mongo' 
$mongoArgs = '--port 27017 db-mongo-cmds.js'

Start-Process -FilePath $mongod -ArgumentList $args1
Start-Process -FilePath $mongod -ArgumentList $args2
Start-Process -FilePath $mongod -ArgumentList $args3
Start-Sleep -Seconds 10
Start-Process -FilePath $mongo -ArgumentList $mongoArgs
