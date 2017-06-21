package DbHelper

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"../common/logger"
)

//抽像接口
type iDataBase interface {
	Query(sql string) []map[string]string
	GetSingle(sql string) string
	ExecuteSql(sql string,arg...interface{})
}

//可使用的数据库
type dataBase struct  {
	db *sql.DB
	connectionString string
}

func (self *dataBase) setConectionString(cs string)  {
	self.connectionString = cs
}

func (self *dataBase) getDbObject() *sql.DB {
	if ( self.db == nil ) {
		db, err := sql.Open("mysql", self.connectionString)
		if err != nil {
			logger.OpenFileLogger().Println(err)
			logger.CloseFileLogger()
		} else {
			self.db = db
		}
	}
	return self.db;
}

func (self *dataBase) Query(sql string) []map[string]string {
	db := self.getDbObject()
	if db == nil {
		return make([]map[string]string,0)
	}
	query, err := db.Query(sql)
	if ( err != nil ) {
		logger.OpenFileLogger().Println(err)
		logger.CloseFileLogger()
		return make([]map[string]string, 0)
	}
	defer query.Close()
	result := query2List(query)
	return result
}

func (self *dataBase) GetSingle(sql string) string {
	db := self.getDbObject()
	if db == nil {
		return ""
	}
	var result string
	row := db.QueryRow(sql)
	row.Scan(&result)
	return result
}

func (self *dataBase) ExecuteSql(sql string,arg...interface{}) {
	db := self.getDbObject()
	if db == nil {
		return
	}
	result, err := db.Query(sql,arg...)
	if ( err != nil ) {
		logger.OpenFileLogger().Println(err)
		logger.CloseFileLogger()
		return
	}
	defer result.Close()
}

func query2List(query *sql.Rows) []map[string]string {
	//读出查询出的列字段名
	column, _ := query.Columns()
	//values是每个列的值，这里获取到byte里
	values := make([][]byte, len(column))
	//因为每次查询出来的列是不定长的，用len(column)定住当次查询的长度
	scans := make([]interface{}, len(column))
	//让每一行数据都填充到[][]byte里面
	for i := range values {
		scans[i] = &values[i]
	}
	//最后得到的map
	results := make([]map[string]string, 0)
	i := 0
	//循环，让游标往下移动
	for query.Next() {
		//query.Scan查询出来的不定长值放到scans[i] = &values[i],也就是每行都放在values里
		if err := query.Scan(scans...); err != nil {
			fmt.Println(err)
			return results
		}
		//每行数据
		row := make(map[string]string)
		//每行数据是放在values里面，现在把它挪到row里
		for k, v := range values {
			key := column[k]
			row[key] = string(v)
		}
		//装入结果集中
		results = append(results, row)
		i++
	}
	return results
}

//空数据库
type nullDataBase struct  {}

func (self *nullDataBase) Query(sql string) []map[string]string {
	return  make([]map[string]string,0)
}

func (self *nullDataBase) GetSingle(sql string) string  {
	return ""
}

func (self *nullDataBase) ExecuteSql(sql string,arg...interface{})  {}