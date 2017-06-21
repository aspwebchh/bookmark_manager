package m3g_game_data

const (
	VERSION_ALL  = "All"
	VERSION_DEFAULT = "default"
	VERSION_2_1_0 = "2.1.0"
)

func GetMapByVersion( key string ) []string {
	switch key {
	case VERSION_ALL:
		return []string{ "DT26","DT35","DT57","DT93","DT88","DU05" }
	case VERSION_DEFAULT:
		return []string{ "DT26","DT88","DU05" }
	case VERSION_2_1_0:
		return []string{"DT26","DT35","DT57","DT93","DT88","DU05"}
	default:
		return []string{}
	}
}