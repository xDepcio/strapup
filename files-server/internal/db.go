package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

const (
	host     = "ep-cool-king-89229861-pooler.eu-central-1.postgres.vercel-storage.com"
	port     = 5432
	user     = "default"
	password = "s2afWbT5cptn"
	dbname   = "verceldb"
)

func Connect() (*sql.DB, error) {
	psqlInfo := fmt.Sprintf(
		"host=%s port=%d user=%s "+"password=%s dbname=%s sslmode=require",
		host, port, user, password, dbname,
	)

	db, err := sql.Open("postgres", psqlInfo)

	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}

	fmt.Println("Successfully connected to database!")
	return db, nil
	// rows, err := DB.Query("SELECT name, email, login FROM users")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer rows.Close()
	// fmt.Println(rows)
	// for rows.Next() {
	// 	var name string
	// 	var email string
	// 	var login string
	// 	if err := rows.Scan(&name, &email, &login); err != nil {
	// 		log.Fatal(err)
	// 	}
	// 	fmt.Printf("Name: %s, Email: %s, Login: %s\n", name, email, login)
	// }

	// fmt.Println("Successfully connected to database!")
	// return nil
}
