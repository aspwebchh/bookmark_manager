package logger

import (
	"os"
	"time"
	"log"
)

func getLogFilePath() string {
	fileName := time.Now().Format("2006_01_02")
	return "log/" + fileName + ".log"
}

var logFile *os.File
var logFileErr error

type FalseLogger struct  {
	log.Logger
}

func OpenFileLogger() * log.Logger{
	logFile, logFileErr = os.OpenFile(getLogFilePath(),os.O_CREATE|os.O_RDWR|os.O_APPEND,os.ModePerm)
	logFlag := log.Ldate|log.Ltime|log.Llongfile
	if logFileErr != nil {
		return log.New(os.Stderr,"", logFlag)
	}
	logger := log.New(logFile,"",logFlag)
	return logger
}

func CloseFileLogger()  {
	if logFile != nil {
		logFile.Close()
		logFile = nil
		logFileErr = nil
	}
}
