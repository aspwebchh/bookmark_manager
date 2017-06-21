package config_manager

import (
	"os"
	"io/ioutil"
	"encoding/xml"
)

type configs struct  {
	ConnectingString string
}

var configData *configs

func getConnectionConfig() (config *configs, err error)   {
	if configData != nil {
		return configData, nil
	}
	file, err := os.Open("config.xml")
	if err != nil {
		return nil, err
	}
	defer file.Close()
	data, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}
	var result =  new(configs)
	err = xml.Unmarshal(data, result)
	if err != nil {
		return nil, err
	}
	configData = result
	return result, nil
}

func GetDbConnectionString()( connectionString string, err error){
	config, err := getConnectionConfig()
	if err == nil {
		 return config.ConnectingString, nil
	} else {
		return "", err
	}
}

