package datatbase

import "errors"

/*__________________________________________ERREUR___________________________________________*/

var (
	ErrMailAlreadyExist     = errors.New("mail exist")
	ErrNicknameAlreadyExist = errors.New("nickname exist")
	ErrCreateUserFaild      = errors.New("creation user in database faild")
	ErrCredentialNotExist   = errors.New("mail no exist")
	ErrPassFormat           = errors.New("password format")
	ErrPassWrong            = errors.New("pass not match")
)

/*__________________________________________________________________________________________*/
