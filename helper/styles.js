import {StyleSheet} from 'react-native'
export const styles =  StyleSheet.create({
    buttonStyle: {
      width: "95%",
      backgroundColor: "#695f51",
      borderColor: "#664d10",
      borderWidth: 1,
      padding: 15,
      margin: 10
    },
    buttontextStyle: {
      color: "#d1bf9b",
      fontSize: 20,
      justifyContent: "center",
      textAlign: "center",
    },
    stView_main: {
      borderBottomWidth: 0.2,
      borderTopWidth: 0.2,
      borderBottomColor: "grey",
      borderTopColor: "grey",
      backgroundColor: "#d1bf9b"
    },
    stImage: {
      height: 50,
      width: 50,
      resizeMode: "contain",
      margin: 5
    },
    stView_sub: {
      marginLeft: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      flexGrow: 1,
      marginRight: 10
    },
    stText_name: {
      fontSize: 20,
      color: "#4b423a",
    },
    stText_duration: {
      fontSize: 15,
      color: "#695f51"
    },
    stText_type: {
      fontSize: 15,
      color: "#695f51",
    },
    stText_header: {
      flexGrow: 1,
      textAlign: "center",
      fontSize: 20,
      backgroundColor: "#695f51",
      color: "#d1bf9b",
      borderWidth: 0.2
    }
  });