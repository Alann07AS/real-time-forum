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
	GO_CREATE_USER = 1
	GO_2           = 2
	GO_3           = 3
	GO_4           = 4
	GO_5           = 5
	GO_6           = 6
	GO_7           = 7
	GO_8           = 8
	GO_9           = 9
	GO_10          = 10
	GO_11          = 11
	GO_12          = 12
	GO_13          = 13
	GO_14          = 14
	GO_15          = 15
	GO_16          = 16
	GO_17          = 17
	GO_18          = 18
	GO_19          = 19
	GO_20          = 20
	GO_21          = 21
	GO_22          = 22
	GO_23          = 23
	GO_24          = 24
	GO_25          = 25
	GO_26          = 26
	GO_27          = 27
	GO_28          = 28
	GO_29          = 29
	GO_30          = 30
)

func init() {
	actionsGO[GO_CREATE_USER] = func(c *Client, args ...interface{}) {
		err := datatbase.CreateUser(args[0].(string), args[1].(string), args[2].(string), args[3].(string), int(args[4].(float64)), args[5].(string))
		errm.LogErr(err) // a remplacer par la fonction qui envoie au js l'erreur si il y en a une (mail exist nickname exist)
	}
}
