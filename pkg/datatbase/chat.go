package datatbase

import (
	"fmt"

	"github.com/Alann07AS/DevTools/GO/errm"
)

func SendMessage(from, to int64, content string) {
	_, err := db.Exec(`
		INSERT INTO chat (Uid_from, Uid_to, Content) VALUES (?, ?, ?)
	`, from, to, content)
	errm.LogErr(err)
}

func GetMessage(from, to int64, limit, ofset int) (m []map[string]string) {
	rows, err := db.Query(`
		SELECT users.Nickname, chat.Content, chat.Date  
		FROM chat
		LEFT JOIN users ON users.ID = chat.Uid_from
		WHERE chat.Uid_from = ? AND chat.Uid_to = ? OR chat.Uid_from = ? AND chat.Uid_to = ?
		ORDER BY chat.Date DESC
		LIMIT ? OFFSET ?;
	`, from, to, to, from, limit, ofset)
	errm.LogErr(err)
	for rows.Next() {
		var fromname, content, date string
		rows.Scan(&fromname, &content, &date)
		m = append(m, map[string]string{})
		m[len(m)-1]["From"] = fromname
		m[len(m)-1]["FromID"] = fmt.Sprint(from)
		m[len(m)-1]["Content"] = content
		m[len(m)-1]["Date"] = date
	}
	if err == nil {
		db.Exec(`DELETE FROM notif_message WHERE chat.Uid_from = ? AND chat.Uid_to = ? `, from, to)
	}
	return
}

func GetNumberNotifFrom(from, to int64) (nb int64) {
	if to == from {
		return
	}
	row := db.QueryRow(`SELECT COUNT(*) FROM notif_message  WHERE notif_message.'From' = ? AND notif_message.'To' = ? `, from, to)
	err := row.Scan(&nb)
	errm.LogErr(err)
	return
}

func GetMostRecentNotifFrom(from, to int64) (date string) {
	if to == from {
		return
	}
	row := db.QueryRow(`SELECT Date FROM chat  WHERE chat.Uid_from = ? AND chat.Uid_to = ? OR chat.Uid_from = ? AND chat.Uid_to = ?
	ORDER BY chat.Date DESC
	LIMIT 1
	`, from, to, to, from)
	row.Scan(&date)
	return
}

func DeleteNotifFrom(from, to int64) (nb int64) {
	_, err := db.Exec(`DELETE FROM notif_message  WHERE notif_message.'From' = ? AND notif_message.'To' = ? `, from, to)
	errm.LogErr(err)
	return
}
