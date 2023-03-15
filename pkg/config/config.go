package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Port    string
	Cookies struct {
		Session  string
		Nickname string
	}
}

var cfg *Config

var isLog = make(chan struct{}, 1)

func GetConfig(c **Config) {
	go func() {
		<-isLog
		isLog <- struct{}{}
		*c = cfg
	}()
}

func LoadConfig(configfilenameroot string) {
	configFile, err := os.Open("./static/json/" + configfilenameroot)
	if err != nil {
		log.Fatal(err)
	}
	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	if err = jsonParser.Decode(&cfg); err != nil {
		log.Fatal(err)
	}
	isLog <- struct{}{}
}
