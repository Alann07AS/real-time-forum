package serverws

import (
	"encoding/json"

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
	return &Jstogo{Client: client, Order: parsedata.Order, Params: parsedata.Params}
}

func (jtg *Jstogo) Exec() {
	actionsGO[jtg.Order](jtg.Client, jtg.Params...)
}

// definition des action possible

var actionsGO = map[int]func(c *Client, args ...interface{}){}

// ordre recu par le js pour etre executer ici
const (
	GO_CREATE_USER         = 1
	GO_CHECK_USER_EXIST    = 2
	GO_LOGIN_USER          = 3
	GO_CHECK_USER_STATUS   = 4
	GO_LOGOUT_USER         = 5
	GO_CREATE_POST         = 6
	GO_GET_MESSAGE_FROM    = 7
	GO_SEND_MESSAGE_TO     = 8
	GO_CLEAR_MESSAGE_NOTIF = 9
	GO_TOGGLE_IS_WRITING   = 10
	GO_GET_COMMENTS        = 11
	GO_CREATE_COMMENT      = 12
	GO_13                  = 13
	GO_14                  = 14
	GO_15                  = 15
	GO_16                  = 16
	GO_17                  = 17
	GO_18                  = 18
	GO_19                  = 19
	GO_20                  = 20
	GO_21                  = 21
	GO_22                  = 22
	GO_23                  = 23
	GO_24                  = 24
	GO_25                  = 25
	GO_26                  = 26
	GO_27                  = 27
	GO_28                  = 28
	GO_29                  = 29
	GO_30                  = 30
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
			c.SwitchHub(forumHub)
			c.UserId = datatbase.GetUserIdBySession(uuid, nickname)
			newMessageBuf := NewGotojsBuffer()
			newMessageBuf.Add(CreateMessageToJs(JS_CREATE_SESSION_COOKIE, uuid, nickname).Byte())
			newMessageBuf.Add(CreateMessageToJs(JS_SHOW_FORUM).Byte())
			newMessageBuf.Add(CreateMessageToJs(JS_UPDATE_CAT, datatbase.GetCatego()).Byte())
			newMessageBuf.Add(CreateMessageToJs(JS_UPDATE_POST, datatbase.GetPost()).Byte())
			newMessageBuf.Add(CreateMessageToJs(JS_ERR_CREDENTIAL, "valid", "login").Byte())
			c.Send(newMessageBuf.Get())
		}
	}

	actionsGO[GO_CHECK_USER_STATUS] = func(c *Client, args ...interface{}) {
		if id := datatbase.GetUserIdBySession(args[0].(string), args[1].(string)); id > 0 {
			c.UserId = id
			newMessageBuf := NewGotojsBuffer()
			newMessageBuf.Add(CreateMessageToJs(JS_SHOW_FORUM).Byte())
			newMessageBuf.Add(CreateMessageToJs(JS_UPDATE_CAT, datatbase.GetCatego()).Byte())
			newMessageBuf.Add(CreateMessageToJs(JS_UPDATE_POST, datatbase.GetPost()).Byte())
			// newMessageBuf.Add(CreateMessageToJs(JS_UPDATE_POST, datatbase.GetPost()).Byte())
			c.Send(newMessageBuf.Get())
		} else {
			c.UserId = 0
			c.Send(CreateMessageToJs(JS_SHOW_LOGIN).Byte())
		}
	}

	actionsGO[GO_LOGOUT_USER] = func(c *Client, args ...interface{}) {
		if id := datatbase.GetUserIdBySession(args[0].(string), args[1].(string)); id == c.UserId {
			c.SwitchHub(loginHub)
			c.UserId = 0
			datatbase.LogOutUserById(id)
			c.Send(CreateMessageToJs(JS_SHOW_LOGIN).Byte())
		} // else {
		// c.Hub.Unregister <- c
		// }
	}

	actionsGO[GO_CREATE_POST] = func(c *Client, args ...interface{}) {
		aInterface := args[2].([]interface{})
		cattable := make([]string, len(aInterface))
		for i, v := range aInterface {
			cattable[i] = v.(string)
		}
		datatbase.CreatePost(c.UserId, args[0].(string), args[1].(string), cattable)
		c.Hub.Broadcast <- CreateMessageToJs(JS_UPDATE_POST, datatbase.GetPost()).Byte()
	}

	actionsGO[GO_GET_MESSAGE_FROM] = func(c *Client, args ...interface{}) {
		m := datatbase.GetMessage(int64(args[0].(float64)), c.UserId, 10, int(args[1].(float64)))
		c.Send(CreateMessageToJs(JS_ADD_MESSAGE, m).Byte())
	}

	actionsGO[GO_SEND_MESSAGE_TO] = func(c *Client, args ...interface{}) {
		to := int64(args[0].(float64))
		if !forumHub.CheckUserActif(to) {
			return
		}
		datatbase.SendMessage(c.UserId, to, args[1].(string))
		m := datatbase.GetMessage(c.UserId, to, 1, 0)
		message := CreateMessageToJs(JS_ADD_MESSAGE, m).Byte()

		var us []map[string]interface{}
		us = append(us, map[string]interface{}{})
		us[0]["ID"] = c.UserId
		us[0]["NotifNB"] = datatbase.GetNumberNotifFrom(c.UserId, to)
		us[0]["Nickname"] = datatbase.GetUserNicknameById(c.UserId)
		us[0]["LastDate"] = datatbase.GetMostRecentNotifFrom(c.UserId, to)
		buf := NewGotojsBuffer()
		buf.Add(message)
		buf.Add(CreateMessageToJs(JS_UPDATE_USER, us).Byte())
		us[0]["ID"] = to
		us[0]["NotifNB"] = datatbase.GetNumberNotifFrom(to, c.UserId)
		us[0]["Nickname"] = datatbase.GetUserNicknameById(to)
		us[0]["LastDate"] = datatbase.GetMostRecentNotifFrom(to, c.UserId)
		buf2 := NewGotojsBuffer()
		buf2.Add(message)
		buf2.Add(CreateMessageToJs(JS_UPDATE_USER, us).Byte())

		forumHub.GetClientById(to).Send(buf.Get())
		c.Send(buf2.Get())
	}

	actionsGO[GO_CLEAR_MESSAGE_NOTIF] = func(c *Client, args ...interface{}) {
		to := int64(args[0].(float64))
		datatbase.DeleteNotifFrom(to, c.UserId)
		var us []map[string]interface{}
		us = append(us, map[string]interface{}{})
		us[0]["ID"] = to
		us[0]["Nickname"] = datatbase.GetUserNicknameById(to)
		us[0]["LastDate"] = datatbase.GetMostRecentNotifFrom(c.UserId, to)
		c.Send(CreateMessageToJs(JS_UPDATE_USER, us).Byte())
	}

	actionsGO[GO_TOGGLE_IS_WRITING] = func(c *Client, args ...interface{}) {
		client := c.Hub.GetClientById(int64(args[0].(float64)))
		if client == nil {
			return
		}
		client.Send(CreateMessageToJs(JS_TOGGLE_IS_WRITING, c.UserId).Byte())
	}

	actionsGO[GO_GET_COMMENTS] = func(c *Client, args ...interface{}) {
		pid := int64(args[0].(float64))
		m := datatbase.GetComment(pid)
		c.Send(CreateMessageToJs(JS_GET_COMMENTS, pid, m).Byte())
	}

	actionsGO[GO_CREATE_COMMENT] = func(c *Client, args ...interface{}) {
		datatbase.CreateComment(c.UserId, int64(args[0].(float64)), args[1].(string))
		actionsGO[GO_GET_COMMENTS](c, args...)
	}
}
