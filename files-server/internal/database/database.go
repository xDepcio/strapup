package database

import (
	"database/sql"
	"fmt"

	"github.com/gofor-little/env"
	_ "github.com/lib/pq"
)

type DbConnectionDetails struct {
	host     string
	port     string
	user     string
	password string
	dbname   string
}

func getDbConnectionFromEnv() DbConnectionDetails {
	host, err := env.MustGet("POSTGRES_HOST")
	if err != nil {
		panic(err)
	}
	port, err := env.MustGet("POSTGRES_PORT")
	if err != nil {
		panic(err)
	}
	user, err := env.MustGet("POSTGRES_USER")
	if err != nil {
		panic(err)
	}
	password, err := env.MustGet("POSTGRES_PASSWORD")
	if err != nil {
		panic(err)
	}
	dbname, err := env.MustGet("POSTGRES_DB")
	if err != nil {
		panic(err)
	}
	return DbConnectionDetails{
		host:     host,
		port:     port,
		user:     user,
		password: password,
		dbname:   dbname,
	}
}

var DB *sql.DB

func Connect() error {
	dbConnectionDetails := getDbConnectionFromEnv()
	var err error
	psqlInfo := fmt.Sprintf(
		"host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable",
		dbConnectionDetails.host, dbConnectionDetails.port, dbConnectionDetails.user, dbConnectionDetails.password, dbConnectionDetails.dbname,
	)

	DB, err = sql.Open("postgres", psqlInfo)

	if err != nil {
		return err
	}
	if err = DB.Ping(); err != nil {
		return err
	}

	return nil
}
