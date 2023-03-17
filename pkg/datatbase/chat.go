package datatbase

import "github.com/Alann07AS/DevTools/GO/errm"

func SendMessage(from, to int64, content string) {
	_, err := db.Exec(`
		INSERT INTO chat (Uid_from, Uid_to, Content) VALUES (?, ?, ?)
	`, from, to, content)
	errm.LogErr(err)
}

func GetMessage(from, to int64) (m []map[string]string) {
	rows, err := db.Query(`
		SELECT users.Nickname, chat.Content, chat.Date  
		FROM chat
		LEFT JOIN users ON users.ID = chat.Uid_from
		WHERE chat.Uid_from = ? AND chat.Uid_to = ? OR chat.Uid_from = ? AND chat.Uid_to = ?
	`, from, to, to, from)
	errm.LogErr(err)
	for rows.Next() {
		var from, content, date string
		rows.Scan(&from, &content, &date)
		m = append(m, map[string]string{})
		m[len(m)-1]["from"] = from
		m[len(m)-1]["content"] = content
		m[len(m)-1]["date"] = date
	}
	return
}
