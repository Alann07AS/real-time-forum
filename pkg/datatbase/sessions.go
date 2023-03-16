package datatbase

import (
	"fmt"

	"github.com/Alann07AS/DevTools/GO/errm"
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

func GetUserIdBySession(uuid, nickname string) (id int64) {
	db.QueryRow("SELECT Userid FROM sessions WHERE Uuid = ? AND Usernickname = ?", uuid, nickname).Scan(&id)
	return
}

// login user--------
func LoginUser(
	Credential,
	Password string,
) (string, string, error) {
	fmt.Println("StartLOGIN")
	// check credential exist
	uid := GetUserIdByMailOrNickname(Credential)
	if uid < 1 {
		return "", "", ErrCredentialNotExist
	}

	// check password
	hashpass := []byte{}
	nickname := ""
	db.QueryRow("SELECT Password, Nickname FROM users WHERE ID = ?", uid).Scan(&hashpass, &nickname)
	errpass := bcrypt.CompareHashAndPassword(hashpass, []byte(Password))
	if errpass != nil {
		return "", "", ErrPassWrong
	}

	// create uuid
	uuid, err := uuid.NewV4()
	errm.LogErr(err)

	_, err = db.Exec("INSERT INTO sessions (Uuid, Userid, Usernickname) VALUES (?, ?, ?)", uuid.String(), uid, nickname)
	errm.LogErr(err)
	return uuid.String(), nickname, nil
}

// login user^^^^^^^^

// logout user--------

func LogOutUserById(userid int64) {
	_, err := db.Exec(`DELETE FROM sessions WHERE Userid = ?`, userid)
	errm.LogErr(err)
}

// logout user^^^^^^^^
