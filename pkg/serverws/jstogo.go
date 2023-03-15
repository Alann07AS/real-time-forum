package serverws

import (
	"encoding/json"
	"fmt"

	"real-time-forum/pkg/datatbase"

	"github.com/Alann07AS/DevTools/GO/errm"
)

type Jstogo struct {
	Client *Client
	Order  int
	Params []interface{}
}

func ParseMessageFromJs(data []byte, client *Client) *Jstogo {
	parsedata := struct {
		Order  int
		Params []interface{}
	}{}
	err := json.Unmarshal(data, &parsedata)
	errm.LogErr(err)
	fmt.Println("COUOCU", string(data))
	return &Jstogo{Client: client, Order: parsedata.Order, Params: parsedata.Params}
}

func (jtg *Jstogo) Exec() {
	fmt.Println("pomm", jtg)
	actionsGO[jtg.Order](jtg.Client, jtg.Params...)
}

// definition des action possible

var actionsGO = map[int]func(c *Client, args ...interface{}){}

// ordre recu par le js pour etre executer ici
const (
	GO_CREATE_USER       = 1
	GO_CHECK_USER_EXIST  = 2
	GO_LOGIN_USER        = 3
	GO_CHECK_USER_STATUS = 4
	GO_5                 = 5
	GO_6                 = 6
	GO_7                 = 7
	GO_8                 = 8
	GO_9                 = 9
	GO_10                = 10
	GO_11                = 11
	GO_12                = 12
	GO_13                = 13
	GO_14                = 14
	GO_15                = 15
	GO_16                = 16
	GO_17                = 17
	GO_18                = 18
	GO_19                = 19
	GO_20                = 20
	GO_21                = 21
	GO_22                = 22
	GO_23                = 23
	GO_24                = 24
	GO_25                = 25
	GO_26                = 26
	GO_27                = 27
	GO_28                = 28
	GO_29                = 29
	GO_30                = 30
)

func init() {
	actionsGO[GO_CREATE_USER] = func(c *Client, args ...interface{}) {
		err := datatbase.CreateUser(args[0].(string), args[1].(string), args[2].(string), args[3].(string), int(args[4].(float64)), args[5].(string))
		errm.LogErr(err) // a remplacer par la fonction qui envoie au js l'erreur si il y en a une (mail exist nickname exist)
		switch err {
		case datatbase.ErrNicknameAlreadyExist:
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, "nickname", "register").Byte())
		case datatbase.ErrMailAlreadyExist:
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, "email", "register").Byte())
		default:
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, "valid", "register").Byte())
		}
	}
	actionsGO[GO_CHECK_USER_EXIST] = func(c *Client, args ...interface{}) {
		if id := datatbase.GetUserIdByMailOrNickname(args[0].(string)); id > 0 {
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, args[1].(string), args[2].(string)).Byte())
		}
	}
	actionsGO[GO_LOGIN_USER] = func(c *Client, args ...interface{}) {
		uuid, nickname, err := datatbase.LoginUser(args[0].(string), args[1].(string))
		switch err {
		case datatbase.ErrCredentialNotExist:
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, "credential", "login").Byte())
		case datatbase.ErrPassWrong:
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, "password", "login").Byte())
		case nil:
			c.UserId = datatbase.GetUserIdBySession(uuid, nickname)
			c.Send(CreateMessageToJs(JS_CREATE_SESSION_COOKIE, uuid, nickname).Byte())
			c.Send(CreateMessageToJs(JS_ERR_CREDENTIAL, "valid", "login").Byte())
		}
	}
	actionsGO[GO_CHECK_USER_STATUS] = func(c *Client, args ...interface{}) {
		if id := datatbase.GetUserIdBySession(args[0].(string), args[1].(string)); id > 0 {
			c.UserId = id
			fmt.Println("ISFINDINSESSION")
			c.Send(CreateMessageToJs(JS_SHOW_FORUM).Byte())
		} else {
			fmt.Println("isnotfind")
			c.UserId = 0
			c.Send(CreateMessageToJs(JS_SHOW_LOGIN).Byte())
		}
	}
}
