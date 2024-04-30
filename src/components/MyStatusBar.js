/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {View, StatusBar, SafeAreaView} from 'react-native';
import {COLORS} from '../theme';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
class MyStatusBar extends PureComponent {
  render() {
    const {backgroundColor, barStyle} = this.props;
    return (
      <View
        style={{
          height: STATUSBAR_HEIGHT,
          backgroundColor: backgroundColor === COLORS.BLACK ? 'transparent' : backgroundColor,
        }}>
        <SafeAreaView>
          <StatusBar translucent backgroundColor={backgroundColor} barStyle={barStyle} />
        </SafeAreaView>
      </View>
    );
  }
}

export default MyStatusBar;
