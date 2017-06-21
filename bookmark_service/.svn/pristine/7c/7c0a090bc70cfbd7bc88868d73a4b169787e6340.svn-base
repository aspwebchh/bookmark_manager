package DbHelper

import (
	"../common/config_manger"
	"../common/logger"
)


var m3gDbDic map[string]*dataBase = make(map[string]*dataBase)

type connectStringResult struct  {
	connectionString string
	err error
}

func getDataBase( key string , connString string)  *dataBase {
	db,ok := m3gDbDic[key]
	if ok {
		return db
	} else {
		db := new(dataBase)
		db.setConectionString(connString)
		m3gDbDic[key] = db
		return db
	}
}

func GetDataBase() iDataBase  {
	var database iDataBase
	connStr,err := config_manager.GetDbConnectionString();
	if err != nil {
		logger.OpenFileLogger().Println(err)
		logger.CloseFileLogger()
		database = new(nullDataBase)
	} else {
		key := "count_db"
		database = getDataBase( key, connStr)
	}
	return database
}
