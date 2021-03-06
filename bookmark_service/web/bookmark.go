package web

import(
	"net/http"
	"../db_helper"
)

type Bookmark struct{
	http.Handler
}

func ( self * Bookmark ) ServeHTTP( response http.ResponseWriter, request *http.Request ) {
	method := request.FormValue("method");
	switch method {
	case "getCategories":
		getCategoryies(response,request);
	case "updateCategories":
		updateCategories(response,request);
	case "getAllPages":
		getAllPages(response,request);
	case "setAllPages":
		setAllPages(response,request);
	}
}

func query( sql string ) string {
	db := DbHelper.GetDataBase();
	return db.GetSingle(sql);
}

func execQuery( sql string, data...interface{} )  {
	db := DbHelper.GetDataBase();
	db.ExecuteSql(sql,data...)
}

func responseWrite( response http.ResponseWriter, request *http.Request, data string )  {
	callback := request.FormValue("callback")
	var jsonpString string
	if( callback != "") {
		jsonpString = callback + "("+ data +")";
	} else {
		jsonpString = data
	}
	response.Header().Add("Access-Control-Allow-Origin","*")
	response.Write([]byte(jsonpString))
}

func getCategoryies( response http.ResponseWriter, request *http.Request ) {
	sql := "select data from bookmark where type = 1"
	result := query(sql)
	responseWrite(response,request,result)
}

func updateCategories( response http.ResponseWriter, request *http.Request )  {
	data := request.FormValue("data")
	sql := "update bookmark set data = ? where type = 1"
	execQuery(sql,data)
	responseWrite(response,request,"")
}

func getAllPages( response http.ResponseWriter, request *http.Request ) {
	sql := "select data from bookmark where type = 2"
	result := query(sql)
	if( result == "") {
		result = "[]";
	}
	responseWrite(response,request,result)
}

func setAllPages( response http.ResponseWriter, request *http.Request )  {
	data := request.FormValue("data")
	sql := "update bookmark set data = ? where type = 2"
	execQuery(sql,data)
	responseWrite(response,request,"")
}

