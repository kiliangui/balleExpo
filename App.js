import { StatusBar } from 'expo-status-bar';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import Svg, { Circle, Rect } from 'react-native-svg';
import { Accelerometer } from 'expo-sensors';
const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

export default function App() {
  const deviceWidth = Dimensions.get('window').width - 50
  const deviceHeight = Dimensions.get('window').height - 10
  const [position, setPosition] = useState({ x: 150, y: 25 });
  const [win, setWin] = useState(false)
  useEffect(() => {
    const listen = Accelerometer.addListener(
      (datas) => {
        setPosition((v) => {
          //console.info(v, deviceWidth,deviceHeight)
          if (v.x <= 40
            && v.x >= -40
            && v.y <= 40
            && v.y >= -40) {
            setWin(true)
            console.log("bon");
          } else {
            console.log("pas bon");
          }
          return { x: clamp(v.x + (Math.round(-datas.x * 10) * 10), -deviceWidth / 2, deviceWidth / 2), y: clamp(v.y + (Math.round(datas.y * 10) * 10), -deviceHeight / 2, deviceHeight / 2) }
        })
      })

    return () => Accelerometer.removeAllListeners()
  }, [])
  useEffect(() => {
    if (win) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      //return Accelerometer.removeAllListeners()

    }
  }, [win])
  return (
  <View style={{ ...styles.container }}>
    {!win? <View style={{ position: 'absolute', zIndex: 1 }}>
      <Svg height={140} width={140}>
        <Circle
          cx={65}
          cy={65}
          r={60}
          {...{ fill: win ? "green" : "black" }}
        >
        </Circle>
      </Svg>
    </View>:<></>}
    
    
        <Animated.View style={{ transform: [{ translateX: position.x }, { translateY: position.y }], }}>
        {
      !win ?
          <Svg height="50" width="50" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="45" fill="yellow" />
          </Svg>
          : <Text style={{ color: 'white', fontSize: 30 }}>Gagné</Text>
        }
        </Animated.View>
        
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
