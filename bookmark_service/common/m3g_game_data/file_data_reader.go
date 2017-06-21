package m3g_game_data

import (
	"os"
	"../logger"
	"io/ioutil"
	"strings"
	"../../common"
)

const PATH_MAP   = "resource/m3g/map.csv"
const PATH_UNIT  = "resource/m3g/unit.csv"
const PATH_ITEM  = "resource/m3g/item.csv"

var cacheData map[string][]map[string]string = make(map[string][]map[string]string);

type MapItem struct {
	ID string
	Name string
	Icon string
}

type UnitItem struct {
	ID string
	Name string
	Country string
}

func getFileContentByPath( path string ) string  {
	file,err := os.Open(path)
	if err != nil {
		logger.OpenFileLogger().Println(err)
		logger.CloseFileLogger()
		return ""
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return ""
	}
	result := string(data)
	return result
}

func csvContent2Map( csvContent string ) []map[string]string  {
	if common.IsNullOrEmpty(csvContent) {
		return []map[string]string{}
	}
    items := strings.Split(csvContent,"\n")
	itemsCount := len(items)
	result := make([]map[string]string, itemsCount - 1, itemsCount - 1 )
	head := items[0]
	body := items[1:]
	headItems := strings.Split(head,",")
	for i, bodyItem := range body{
		bodyItems := strings.Split(bodyItem,",")
		resultItem := make(map[string]string)
		for j, headItem := range headItems{
			resultItem[ common.Trim( headItem ) ]  = common.Trim( bodyItems[j] )
		}
		result[i] = resultItem
	}
	return result
}

func getDicFromCsv(path string  )[]map[string]string {
	key := common.GetMd5String(path)
	data, ok := cacheData[key]
	if ok {
		return data
	}
	csvContent := getFileContentByPath(path)
	dicData := csvContent2Map(csvContent)
	cacheData[key] = dicData
	return dicData
}

func GetMapItemByMapId( mapId string ) MapItem{
	mapId = common.Trim(mapId)
	mapData := getDicFromCsv(PATH_MAP)
	result := MapItem{}
	for _, item := range mapData {
		if item["ID"] == mapId {
			result.ID = mapId
			result.Name = item["Name"]
			result.Icon = item["Icon"]
		}
	}
	return result
}

func GetUnitItemByUnitId( unitId string ) UnitItem  {
	unitId = common.Trim(unitId)
	data := getDicFromCsv(PATH_UNIT)
	result := UnitItem{}
	for _, item := range data {
		if item["ID"] == unitId {
			result.ID = unitId
			result.Name = item["Name"]
			result.Country = item["country"]
		}
	}
	return result
}