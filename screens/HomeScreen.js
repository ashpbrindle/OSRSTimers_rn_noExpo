import React, {Component} from 'react';
import { Text, TouchableOpacity, View, FlatList, Image, ScrollView, StatusBar, Alert, Dimensions, Platform } from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import PushNotification from 'react-native-push-notification'
import BackgroundTimer from 'react-native-background-timer'
import {timers_tree} from '../data/trees.js'
import {timers_specialTree} from '../data/specialTrees.js'
import {timers_hardwoodTree} from '../data/hardwoodTrees'
import {timers_birdhouse} from '../data/birdhouses.js'
import {timers_fruitTree} from '../data/fruitTrees.js'
import {timers_flowers} from '../data/flowers.js'
import {timers_herb} from '../data/herbs.js'
import {timers_hop} from '../data/hops.js'
import {timers_bush} from '../data/bush.js'
import {timers_allotment} from '../data/allotments.js'
import {styles} from '../helper/styles.js'
import {findIcon, getDoubleNumber} from '../helper/helper.js'

export default class HomeScreen extends Component {
  state = {
    timers_shown: [],
    view_shown: false,
    view_status: "Show Timers",
    now: null
  }

  constructor(props) {
    super(props)
    this.initaliseNotifications()
    this.loadData()
    StatusBar.setHidden(true);
  }

  initaliseNotifications = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },

      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios'
    });
  }

  storeData = async () => {
    console.log("---SAVING---")
    console.log(this.state.timers_shown)

    try {
      await AsyncStorage.setItem("timers", JSON.stringify(this.state.timers_shown))
    } catch (e) {
      console.log(e)
    }
  }

  loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("timers")
      if (data !== null) {
        console.log("---LOADING---")
        console.log(data)
        this.setState({timers_shown: JSON.parse(data)}, () => {
          var today = new Date()
          today = today.toISOString()

          this.setState({now: today}, () => {
            var temp = [...this.state.timers_shown]
            for (var i = 0; i < temp.length; i++) {
              if (temp[i].time_stamp != -1) {
                var d1 = new Date(this.state.now)
                var d2 = new Date(temp[i].time_stamp);
                console.log(temp[i].time_stamp)
                console.log(this.state.now)
                console.log(d2 - d1)

                if (d2 - d1 > 0) { 
                  console.log("setting timer")
                  var temp2 = [...this.state.timers_shown]
                  var index = i
                  temp2[i].timer_id = setInterval(() => {
                    temp2[index].item_status = "Finished"
                    temp2[index].item_running = false
                    temp2[index].time_stamp = -1
                    this.setState({timers_shown: temp2}, () => {
                      this.storeData()
                    })
                  }, (d2 - d1))
                }
              }
              if (this.state.now > temp[i].time_stamp || temp[i].time_stamp == -1) {
                console.log("timer finised")
                if (temp[i].time_stamp == -1) {
                  temp[i].item_status = "Not Running"
                }
                else {
                  temp[i].item_status = "Finished"
                }
                temp[i].item_running = false
                temp[i].time_stamp = -1
                this.setState({timers_shown: temp}, () => {
                  this.storeData()
                })
              }
            }
          })
        })

      }
      else {
        console.log("--- NO DATA ---")
      }
    } catch (e) {
      console.log(e)
    }
  }

  changeButtonImage = () => {
    switch(this.state.view_shown) {
      case true:
        return require("../assets/img_hide.png");
      case false:
        return require("../assets/img_show.png")
      default:
          break;
    }
  }

  changeShownButton = (index) => {
    switch(this.state.timers_shown[index].item_running) {
      case true:
        return require("../assets/img_stop.png");
      case false:
        return require("../assets/img_play.png")
      default:
          break;
    }
  }

  onStartPress = async (item, index) => {
    const ONE_SECOND = 1000
    const id = PushNotification.localNotificationSchedule({
      //... You can use all the options from localNotifications
      id: item.key,
      largeIcon: "",
      title: "Timer Finished!",
      message: "Your " + item.name + " is Ready", // (required)
      date: new Date(Date.now() + (item.duration * 60) * ONE_SECOND), // in 60 secs
      allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    });

    var temp = [...this.state.timers_shown]

    temp[index].timer_id = setInterval(() => {
      var temp2 = [...this.state.timers_shown]
      temp2[index].item_status = "Finished"
      temp2[index].item_running = false
      temp2[index].time_stamp -1
      this.setState({timers_shown: temp}, () => {
        this.storeData()
      })
    }, (item.duration * 60) * ONE_SECOND)
    this.setState({timers_shown: temp}, () => {
      this.storeData()
    })

  }

  onDeletePress(item) {
    Alert.alert(
      "Are you sure you want to delete your " + item.name,
      "This will delete the " + item.name + " item from your saved list",
      [
        {
          text: "Cancel",
          onPress: () => {return},
          style: "cancel"
        },
        { text: "Delete", onPress: () =>  {
          this.setState({timers_shown: this.state.timers_shown.filter((_item)=>_item.key !== item.key)}, () => {
            this.storeData()
          })
        }}
      ],
      { cancelable: true }
    );
  }

  onAddPress(item) {

    for (var i = 0; i < this.state.timers_shown.length; i++) {
      if (item.name == this.state.timers_shown[i].name) {
        console.log(item.key)
        console.log(item.name)
        console.log(this.state.timers_shown[i].key)
        console.log(this.state.timers_shown[i].name)
        Alert.alert(
          "Cannot Add Item",
          item.name + " Already Exists in Your Saved List",
          [
            {
              text: "Ok",
              onPress: () => {return},
              style: "cancel"
            }
          ],
          { cancelable: true }
        );
        return
      }
    }

    var ob = {
      name: item.name,
      duration: item.duration,
      type: item.type,
      img: item.img,
      key: this.state.timers_shown.length,
      item_status: "Not Running",
      item_running: false,
      notify_id: "",
      time_stamp: -1,
      timer_id: "",
      level: item.level,
      skill: item.skill
    }


    let temp = [...this.state.timers_shown]
    temp.push(ob)
    this.setState({timers_shown: temp}, () => {
      this.storeData()
    })

  }

  render() {

    const {w,h} = Dimensions.get("window")

    return (
      <View style = {{backgroundColor: "#d1bf9b", justifyContent: "space-between", flex: 1}}>
        <ScrollView styles = {{height: "100%", backgroundColor: "#F5F5DC", flex: 1 }}>
          <View style = {{alignItems: "stretch", justifyContent:"center", resizeMode:"contain"}}>
            <Image style ={{flexGrow: 1, alignItems:"center", justifyContent: "center", resizeMode:"contain", height: 100, width: w }} source = {require("../assets/img_header.png")}></Image>
          </View>
          {this.state.timers_shown.length > 0 ? <Text style = {styles.stText_header}>Current Timers</Text> : null}
          <FlatList
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          data={this.state.timers_shown}
          keyExtractor={(timer) => { timer.key }}
          renderItem={({item, index}) => {
            return (
              <View style = {styles.stView_main}>
                <View style={{flexDirection: "row"}}>
                  <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                    <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                  </View>
                  <Image source={findIcon(item)} style={styles.stImage}></Image>
                  <View style={{flexDirection:"column", flex: 1}}>
                    <View style={styles.stView_sub}>
                      <Text style={styles.stText_name}>{item.name}</Text>
                      <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                    </View>
                    <View style={styles.stView_sub}>
                      <View>
                        <Text style={styles.stText_type}>{item.type}</Text>
                        <Text style = {styles.stText_type}>{item.item_status}</Text>
                      </View>
                      <View style = {{flexDirection: "row"}}>
                        <TouchableOpacity 
                        style = {{width: 30, height: 30, marginBottom: 10, marginRight: 20, }}
                        onPress={() => {
                          if (!this.state.timers_shown[index].item_running) {

                            var now = new Date()
                            var newDateObj = new Date(now.getTime() + item.duration*60000);

                            var temp = [...this.state.timers_shown]
                            temp[index].item_status = "Running: " + getDoubleNumber(newDateObj.getHours()) + ":" + getDoubleNumber(newDateObj.getMinutes()) + " " + getDoubleNumber(newDateObj.getDate()) + "/" + getDoubleNumber(newDateObj.getMonth()) + "/" + newDateObj.getFullYear()
                            temp[index].item_running = true
                            var finish = new Date()
                            finish.setSeconds(now.getSeconds() + (item.duration * 60))
                            console.log(finish)
                            temp[index].time_stamp = finish
                            this.setState({timers_shown: temp}, () => {
                              this.storeData()
                              this.onStartPress(item, index)
                            })
                          }
                          else {
                            // stop timer and notification
                            clearInterval(item.timer_id)
                            var temp = [...this.state.timers_shown]
                              temp[index].item_status = "Not Running"
                              temp[index].timer_id = ""
                              temp[index].time_stamp = -1
                                temp[index].item_running = false
                                this.setState({timers_shown: temp}, () => {
                                  this.storeData()
                                })

                            PushNotification.cancelLocalNotifications({id: item.key});
                          }
                        }}>
                          <Image source={this.changeShownButton(index)} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                        disabled={item.item_running}
                        onPress={() => this.onDeletePress(item)}>
                          {item.item_running == false ? <Image source={require("../assets/img_delete.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image> : null}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}>
          </FlatList>
          <TouchableOpacity
          style = {styles.buttonStyle}
          onPress = {() => {
            if (this.state.view_shown == true) {
              this.setState({view_shown: !this.state.view_shown})
              this.setState({view_status: "Add Timers"})
            }
            else {
              this.setState({view_shown: !this.state.view_shown})
              this.setState({view_status: "Hide Timers"})
            }
          }}>
            <View style = {{flexDirection: "row", justifyContent: "space-between"}}>
              <Text style = {styles.buttontextStyle}>{this.state.view_status}</Text>
              <Image source={this.changeButtonImage()} style={{resizeMode:"contain", width: 20, height: 20}}></Image>
            </View>
          </TouchableOpacity>
          {this.state.view_shown ? <View>
            <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Trees</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_tree}
              keyExtractor={(timer) => { timer.key }}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Fruit Trees</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_fruitTree}
              keyExtractor={(timer) => { timer.key }}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Hardwood Trees</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_hardwoodTree}
              keyExtractor={(timer) => { timer.key }}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Special Trees</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_specialTree}
              keyExtractor={(timer) => { timer.key }}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>

              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Allotments</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_allotment}
              keyExtractor={(timer) => { timer.key }}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Herbs</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_herb}
              keyExtractor={(timer) => { timer.key }}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Flowers</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_flowers}
              keyExtractor={(timer) => { timer.key }}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Hops</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_hop}
              keyExtractor={(timer) => { timer.key }}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{getDoubleNumber(parseInt(item.level))}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_farming.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Bushes</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              data={timers_bush}
              keyExtractor={(timer) => { timer.key }}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{item.level}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
              <View style= {{flexDirection: "row", height: 40, backgroundColor: "#695f51"}}> 
                <View style= {{alignContent: "center", justifyContent: "center", alignItems: "center"}}>
                  <Image style = {{resizeMode:"contain", height: 35, width: 35}} source={require("../assets/img_hunter.png")}></Image>
                </View>
                <Text style = {styles.stText_header}>Birdhouses</Text>
              </View>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              initialNumToRender = {0}
              maxToRenderPerBatch={3}
              data={timers_birdhouse}
              keyExtractor={(timer) => { timer.key }}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
                      <View style={{borderRightWidth:0.2, borderColor: "grey",justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize: 30, color: "#695f51", justifyContent:"center", alignItems:"center", fontFamily: "sans-serif-thin"}}>{item.level}</Text>
                      </View>
                      <Image source={findIcon(item)} style={styles.stImage}></Image>
                      <View style={{flexDirection:"column", flex: 1}}>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_name}>{item.name}</Text>
                          <Text style={styles.stText_duration}>{(item.duration / 60).toFixed(1) + "hrs"}</Text>
                        </View>
                        <View style={styles.stView_sub}>
                          <Text style={styles.stText_type}>{item.type}</Text>
                          <TouchableOpacity 
                          style = {{width: 30, height: 30, marginBottom: 10, marginRight: 5}}
                          onPress={() => this.onAddPress(item)}>
                            <Image source={require("../assets/img_add.png")} style={{resizeMode:"contain", width: 30, height: 30}}></Image>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              }}>
              </FlatList>
          </View> : null}
        </ScrollView>
      </View>
    );
  }
}
