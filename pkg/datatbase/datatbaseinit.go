package datatbase

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func OpenDB() {
	db, _ = sql.Open("sqlite3", "./database.db")

	// enable foregein key
	db.Exec("PRAGMA foreign_keys = ON")

	// pool de conection
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
}


