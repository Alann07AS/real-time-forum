package datatbase

import "github.com/Alann07AS/DevTools/GO/errm"

func GetCatego() (tablecat []string) {
	rows, err := db.Query("SELECT Name FROM categories")
	errm.LogErr(err)
	for rows.Next() {
		name := ""
		rows.Scan(&name)
		tablecat = append(tablecat, name)
	}
	return
}

func CreatePost(userid int64, posttitle, postcontent string, categories []string) {
	var err error
	tx, err := db.Begin()
	defer func() {
		if err != nil {
			tx.Rollback()
			return
		}
		tx.Commit()
	}()
	errm.LogErr(err)
	res, err := tx.Exec("INSERT INTO posts (Title, Content, Userid) VALUES (?, ?, ?)", posttitle, postcontent, userid)
	errm.LogErr(err)
	if err != nil {
		return
	}
	lastid, _ := res.LastInsertId()
	for _, c := range categories {
		_, err = tx.Exec("INSERT INTO postcatego (Postid, Catname) VALUES (?, ?)", lastid, c)
		errm.LogErr(err)
		if err != nil {
			return
		}
	}
}

func GetPost() (m []map[string]string) {
	rows, err := db.Query(`
	SELECT posts.ID, posts.Title, posts.Content, users.Nickname  FROM posts
	LEFT JOIN users ON users.ID = posts.Userid
	LIMIT 10 OFFSET 0;
	`)
	errm.LogErr(err)
	var Title, Content, Username, ID string
	for rows.Next() {
		m = append(m, map[string]string{})
		rows.Scan(&ID, &Title, &Content, &Username)
		m[len(m)-1]["Title"] = Title
		m[len(m)-1]["Content"] = Content
		m[len(m)-1]["Username"] = Username
		m[len(m)-1]["ID"] = ID
	}
	return
}
