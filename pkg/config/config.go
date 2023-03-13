package config

import (
	"encoding/json"
	"log"
	"os"
)

type Config struct {
	Port    string
	Cookies struct {
		Session string
	}
}

var cfg *Config

func GetConfig() *Config {
	return cfg
}

func LoadConfig(configfilenameroot string) {
	configFile, err := os.Open(configfilenameroot)
	if err != nil {
		log.Fatal(err)
	}
	defer configFile.Close()

	jsonParser := json.NewDecoder(configFile)
	if err = jsonParser.Decode(&cfg); err != nil {
		log.Fatal(err)
	}
}
