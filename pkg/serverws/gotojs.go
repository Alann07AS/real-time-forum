package serverws

import (
	"encoding/json"

	"github.com/Alann07AS/DevTools/GO/errm"
)

type Gotojs struct {
	Order  int
	Params []interface{}
}

func CreateMessageToJs(order int, params ...interface{}) *Gotojs {
	return &Gotojs{order, params}
}

func (g *Gotojs) Byte() []byte {
	table, err := json.Marshal(g)
	errm.LogErr(err)
	return table
}

const (
	JS_ERR_CREDENTIAL = 1
	JS_2              = 2
	JS_3              = 3
	JS_4              = 4
	JS_5              = 5
	JS_6              = 6
	JS_7              = 7
	JS_8              = 8
	JS_9              = 9
	JS_10             = 10
	JS_11             = 11
	JS_12             = 12
	JS_13             = 13
	JS_14             = 14
	JS_15             = 15
	JS_16             = 16
	JS_17             = 17
	JS_18             = 18
	JS_19             = 19
	JS_20             = 20
	JS_21             = 21
	JS_22             = 22
	JS_23             = 23
	JS_24             = 24
	JS_25             = 25
	JS_26             = 26
	JS_27             = 27
	JS_28             = 28
	JS_29             = 29
	JS_30             = 30
)
