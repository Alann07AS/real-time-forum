package datatbase

import (
	"strings"

	"github.com/Alann07AS/DevTools/GO/errm"
	"golang.org/x/crypto/bcrypt"
)

// create user--------
func CreateUser(
	Nickname,
	Email,
	Lastname,
	Firstname string,
	Age int,
	Password string,
) error {
	// check mail exist
	if GetUserIdByMailOrNickname(Email) > 0 {
		return ErrMailAlreadyExist
	}

	// check Nickname Exist
	if GetUserIdByMailOrNickname(Nickname) > 0 {
		return ErrNicknameAlreadyExist
	}

	// check pass word format
	if !CheckPasswordFormat(Password) {
		return ErrPassFormat
	}

	// hash password before store
	hashPass, err := bcrypt.GenerateFromPassword([]byte(Password), bcrypt.DefaultCost)
	errm.LogErr(err)

	_, err = db.Exec("INSERT INTO users (Nickname, Email, Lastname, Firstname, Age, Password) VALUES (?, ?, ?, ?, ?, ?)", Nickname, Email, Lastname, Firstname, Age, hashPass)
	errm.LogErr(err)
	return nil
}

func CheckPasswordFormat(pass string) bool {
	return pass != "" // verifie le format du mdp
}

// create user^^^^^^^^

// return user ID or 0 if no exist
func GetUserIdByMailOrNickname(login string) (id int64) {
	login = strings.ToLower(login)
	db.QueryRow("SELECT ID FROM users WHERE lower(Nickname) = ? OR lower(Email) = ?", login, login).Scan(&id)
	return
}

func GetUser() (m []map[string]interface{}) {
	rows, err := db.Query(`
		SELECT ID, Nickname FROM users
	`)
	errm.LogErr(err)
	for rows.Next() {
		var ID int64
		var Nickname string
		rows.Scan(&ID, &Nickname)
		m = append(m, map[string]interface{}{})
		m[len(m)-1]["ID"] = ID
		m[len(m)-1]["Nickname"] = Nickname
	}
	return
}

func GetUserNicknameById(uid int64) (nickname string) {
	row := db.QueryRow(`
		SELECT Nickname FROM users WHERE ID = ?
	`, uid)
	row.Scan(&nickname)
	return
}
