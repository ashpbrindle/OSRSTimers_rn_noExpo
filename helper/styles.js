import {StyleSheet} from 'react-native'
export const styles =  StyleSheet.create({
    buttonStyle: {
      flex: 1,
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
      fontFamily: "sans-serif"
    },
    stView_main: {
      borderBottomWidth: 0.2,
      borderTopWidth: 0.2,
      borderBottomColor: "grey",
      borderTopColor: "grey",
      backgroundColor: "#d1bf9b",
      justifyContent: "center",
      alignItems: "center",
      width: "100%"
    },
    stImage: {
      height: 35,
      width: 35,
      resizeMode: "contain",
      alignSelf: "center",
      margin: 5
    },
    stView_sub: {
      marginLeft: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      flexGrow: 1,
      flex: 1,
      marginRight: 10
    },
    stText_name: {
      color: "#695f51",
      fontFamily: "sans-serif",
      fontWeight: "bold"
    },
    stText_duration: {
      color: "#695f51",
      fontFamily: "sans-serif"
    },
    stText_type: {
      color: "#695f51",
      fontFamily: "sans-serif",
    },
    stText_header: {
      flexGrow: 1,
      width: "100%",
      textAlign: "left",
      backgroundColor: "#695f51",
      color: "#d1bf9b",
      borderStartWidth:0.2,
      borderTopWidth: 0.2,
      borderBottomWidth: 0.2,
      fontFamily: "sans-serif",
      alignSelf: "center",
      padding: 5,
      paddingLeft: 10, 
      height: 40,
      paddingTop: 7.5
    }
  });