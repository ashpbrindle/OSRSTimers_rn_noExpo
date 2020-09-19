import React, {Component} from 'react';
import { Text, TouchableOpacity, View, FlatList, Image, AsyncStorage, ScrollView, StatusBar, Alert, Dimensions, Platform } from "react-native";
import PushNotification from 'react-native-push-notification'
import {timers_tree} from '../data/trees.js'
import {timers_specialTree} from '../data/specialTrees.js'
import {timers_hardwoodTree} from '../data/hardwoodTrees'
import {timers_birdhouse} from '../data/birdhouses.js'
import {timers_fruitTree} from '../data/fruitTrees.js'
import {timers_flowers} from '../data/flowers.js'
import {timers_herb} from '../data/herbs.js'
import {timers_hop} from '../data/hops.js'
import {timers_bush} from '../data/bush.js'
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
    try {
      await AsyncStorage.setItem("timers", JSON.stringify(this.state.timers_shown))
    } catch (e) {
      console.log(e)
    }
  }

  loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("timers")
      // if (data !== null) {
      //   this.setState({timers_shown: JSON.parse(data)}, () => {
      //     Notifications.addListener((notification) => {
      //       var notification_id = notification.notificationId
      //       var timers_copy = [...this.state.timers_shown]

      //       for (var index = 0; index < timers_copy.length; index++) {
      //         if (timers_copy[index].notify_id == notification_id) {
      //           timers_copy[index].item_status = "Finished"
      //           timers_copy[index].item_running = false
      //           this.setState({timers_shown: timers_copy}, () => {
      //             this.storeData()
      //           })
      //         }
      //       }
      //     })
      //     var today = new Date()
      //     today = today.toISOString()
      //     this.setState({now: today}, () => {
      //       var temp = [...this.state.timers_shown]
      //       for (var i = 0; i < temp.length; i++) {
      //       if (this.state.now > temp[i].time_stamp || temp[i].time_stamp == -1) {
      //         temp[i].item_status = "Finished"
      //         temp[i].item_running = false
      //         temp[i].time_stamp = -1
      //         this.setState({timers_shown: temp}, () => {
      //           this.storeData()
      //         })
      //       }
      //     }
      //     })

      //   })
      // }
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
    PushNotification.localNotification({
      title: item.name, // (optional)
      message: item.name + " is ready", // (required)
    });
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
    var ob = {
      name: item.name,
      duration: item.duration,
      type: item.type,
      img: item.img,
      key: this.state.timers_shown.length,
      item_status: "Not Running",
      item_running: false,
      notify_id: "",
      time_stamp: -1
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
                            var today = new Date()
                            today.setSeconds(now.getSeconds() + (item.duration * 60))
                            temp[index].time_stamp = today
                            this.setState({timers_shown: temp}, () => {
                              this.storeData()
                              this.onStartPress(item, index)
                            })
                          }
                          else {
                            // stop timer and notification
                            var temp = [...this.state.timers_shown]
                              temp[index].item_status = "Not Running"
                                temp[index].item_running = false
                                this.setState({timers_shown: temp}, () => {
                                  this.storeData()
                                })
                            const id = item.notify_id
                            //Notifications.cancelScheduledNotificationAsync(id)
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
              <Text style = {styles.stText_header}>Trees</Text>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_tree}
              keyExtractor={(timer) => { timer.key }}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
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
              <Text style = {styles.stText_header}>Fruit Trees</Text>
              <FlatList
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
              data={timers_fruitTree}
              keyExtractor={(timer) => { timer.key }}
              renderItem={({item}) => {
                return (
                  <View style = {styles.stView_main}>
                    <View style={{flexDirection: "row"}}>
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
              <Text style = {styles.stText_header}>Hardwood Trees</Text>
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
              <Text style = {styles.stText_header}>Special Trees</Text>
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
              <Text style = {styles.stText_header}>Herbs</Text>
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
              <Text style = {styles.stText_header}>Flowers</Text>
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
              <Text style = {styles.stText_header}>Hops</Text>
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
              <Text style = {styles.stText_header}>Bushes</Text>
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
              <Text style = {styles.stText_header}>Birdhouses</Text>
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
