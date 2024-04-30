import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  I18nManager,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewPropTypes,
} from 'react-native';

import DropdownItem from '../item';
import styles from './styles';
import {COLORS, FONTS} from '../../../theme';

export default class Dropdown extends PureComponent {
  static defaultProps = {
    hitSlop: {top: 6, right: 4, bottom: 6, left: 4},

    disabled: false,

    data: [],

    valueExtractor: ({value} = {}) => value,
    labelExtractor: ({label} = {}) => label,
    propsExtractor: () => null,

    absoluteRTLLayout: false,

    dropdownOffset: {
      top: 32,
      left: 0,
    },

    dropdownMargins: {
      min: 8,
      max: 16,
    },

    rippleCentered: false,
    rippleSequential: true,

    rippleInsets: {
      top: 16,
      right: 0,
      bottom: -8,
      left: 0,
    },

    rippleOpacity: 0.54,
    shadeOpacity: 0.12,

    rippleDuration: 400,
    animationDuration: 225,

    fontSize: 16,

    textColor: 'rgba(0, 0, 0, .87)',
    itemColor: 'rgba(0, 0, 0, .54)',
    baseColor: 'rgba(0, 0, 0, .38)',

    itemCount: 4,
    itemPadding: 8,

    supportedOrientations: [
      'portrait',
      'portrait-upside-down',
      'landscape',
      'landscape-left',
      'landscape-right',
    ],

    useNativeDriver: false,
  };

  static propTypes = {
    ...TouchableWithoutFeedback.propTypes,

    disabled: PropTypes.bool,

    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    data: PropTypes.arrayOf(PropTypes.object),

    valueExtractor: PropTypes.func,
    labelExtractor: PropTypes.func,
    propsExtractor: PropTypes.func,

    absoluteRTLLayout: PropTypes.bool,

    dropdownOffset: PropTypes.shape({
      top: PropTypes.number.isRequired,
      left: PropTypes.number.isRequired,
    }),

    dropdownMargins: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }),

    dropdownPosition: PropTypes.number,

    rippleColor: PropTypes.string,
    rippleCentered: PropTypes.bool,
    rippleSequential: PropTypes.bool,

    rippleInsets: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),

    rippleOpacity: PropTypes.number,
    shadeOpacity: PropTypes.number,

    rippleDuration: PropTypes.number,
    animationDuration: PropTypes.number,

    fontSize: PropTypes.number,

    textColor: PropTypes.string,
    itemColor: PropTypes.string,
    selectedItemColor: PropTypes.string,
    disabledItemColor: PropTypes.string,
    baseColor: PropTypes.string,

    itemTextStyle: Text.propTypes.style,

    itemCount: PropTypes.number,
    itemPadding: PropTypes.number,

    onLayout: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onChangeText: PropTypes.func,

    renderBase: PropTypes.func,
    renderAccessory: PropTypes.func,

    labelContainerStyle: (ViewPropTypes || View.propTypes).style,
    containerStyle: (ViewPropTypes || View.propTypes).style,
    overlayStyle: (ViewPropTypes || View.propTypes).style,
    pickerStyle: (ViewPropTypes || View.propTypes).style,

    supportedOrientations: PropTypes.arrayOf(PropTypes.string),

    useNativeDriver: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onSelect = this.onSelect.bind(this);
    this.onLayout = this.onLayout.bind(this);

    this.updateContainerRef = this.updateRef.bind(this, 'container');
    this.updateScrollRef = this.updateRef.bind(this, 'scroll');

    this.renderAccessory = this.renderAccessory.bind(this);
    this.renderItem = this.renderItem.bind(this);

    this.keyExtractor = this.keyExtractor.bind(this);

    this.blur = () => this.onClose();
    this.focus = this.onPress;

    let {value} = this.props;

    this.mounted = false;
    this.focused = false;

    this.state = {
      opacity: new Animated.Value(0),
      selected: -1,
      modal: false,
      value,
    };
  }

  componentWillReceiveProps({value}) {
    if (value !== this.props.value) {
      this.setState({value});
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onPress(event) {
    let {
      data,
      disabled,
      onFocus,
      rippleDuration,
      dropdownOffset,
      dropdownMargins: {min: minMargin, max: maxMargin},
      animationDuration,
      absoluteRTLLayout,
      useNativeDriver,
      productDetailScreen,
    } = this.props;

    if (disabled) {
      return;
    }

    let itemCount = data.length;
    let timestamp = Date.now();

    if (event != null) {
      /* Adjust event location */
      event.nativeEvent.locationY -= this.rippleInsets().top;
      event.nativeEvent.locationX -= this.rippleInsets().left;

      /* Start ripple directly from event */
      // this.ripple.startRipple(event);
    }

    if (!itemCount) {
      return;
    }

    this.focused = true;

    if (typeof onFocus === 'function') {
      onFocus();
    }

    let dimensions = Dimensions.get('window');

    this.container.measureInWindow((x, y, containerWidth) => {
      let {opacity} = this.state;

      /* Adjust coordinates for relative layout in RTL locale */
      if (I18nManager.isRTL && !absoluteRTLLayout) {
        x = dimensions.width - (x + containerWidth);
      }

      let delay = Math.max(
        0,
        rippleDuration - animationDuration - (Date.now() - timestamp),
      );
      let selected = this.selectedIndex();

      let leftInset;
      let left = x + dropdownOffset.left;

      if (left > minMargin) {
        leftInset = maxMargin;
      } else {
        left = minMargin;
        leftInset = minMargin;
      }

      let right = x + containerWidth + maxMargin;
      let rightInset;

      if (dimensions.width - right > minMargin) {
        rightInset = maxMargin;
      } else {
        right = dimensions.width - minMargin;
        rightInset = minMargin;
      }

      let top = productDetailScreen ? y + 47 : y + 40;

      this.setState({
        modal: true,
        width: right - left - 15,
        top,
        left,
        leftInset,
        rightInset,
        selected,
      });

      setTimeout(() => {
        if (this.mounted) {
          this.resetScrollOffset();

          Animated.timing(opacity, {
            duration: animationDuration,
            toValue: 1,
            useNativeDriver,
          }).start(() => {
            if (this.mounted && Platform.OS === 'ios') {
              let {flashScrollIndicators} = this.scroll || {};

              if (typeof flashScrollIndicators === 'function') {
                flashScrollIndicators.call(this.scroll);
              }
            }
          });
        }
      }, delay);
    });
  }

  onClose(value = this.state.value) {
    let {onBlur, animationDuration, useNativeDriver} = this.props;
    let {opacity} = this.state;

    Animated.timing(opacity, {
      duration: animationDuration,
      toValue: 0,
      useNativeDriver,
    }).start(() => {
      this.focused = false;

      if (typeof onBlur === 'function') {
        onBlur();
      }

      if (this.mounted) {
        this.setState({value, modal: false});
      }
    });
  }

  onSelect(index) {
    let {
      data,
      valueExtractor,
      onChangeText,
      animationDuration,
      rippleDuration,
    } = this.props;

    let value = valueExtractor(data[index], index);
    let delay = Math.max(0, rippleDuration - animationDuration);

    if (typeof onChangeText === 'function') {
      onChangeText(value, index, data);
    }

    setTimeout(() => this.onClose(value), delay);
  }

  onLayout(event) {
    let {onLayout} = this.props;

    if (typeof onLayout === 'function') {
      onLayout(event);
    }
  }

  value() {
    let {value} = this.state;

    return value;
  }

  selectedIndex() {
    let {value} = this.state;
    let {data, valueExtractor} = this.props;

    return data.findIndex(
      (item, index) => item != null && value === valueExtractor(item, index),
    );
  }

  selectedItem() {
    let {data} = this.props;

    return data[this.selectedIndex()];
  }

  isFocused() {
    return this.focused;
  }

  itemSize() {
    let {fontSize, itemPadding} = this.props;

    return Math.ceil(fontSize + itemPadding * 1.5);
  }

  visibleItemCount() {
    let {data, itemCount} = this.props;

    return Math.min(data.length, itemCount);
  }

  tailItemCount() {
    return Math.max(this.visibleItemCount() - 2, 0);
  }

  rippleInsets() {
    let {
      top = 16,
      right = 0,
      bottom = -8,
      left = 0,
    } = this.props.rippleInsets || {};

    return {top, right, bottom, left};
  }

  resetScrollOffset() {
    let {selected} = this.state;
    let {data, dropdownPosition} = this.props;

    let offset = 0;
    let itemCount = data.length;
    let itemSize = this.itemSize();
    let tailItemCount = this.tailItemCount();
    let visibleItemCount = this.visibleItemCount();

    if (itemCount > visibleItemCount) {
      if (dropdownPosition == null) {
        switch (selected) {
          case -1:
            break;

          case 0:
          case 1:
            break;

          default:
            if (selected >= itemCount - tailItemCount) {
              offset = itemSize * (itemCount - visibleItemCount);
            } else {
              offset = itemSize * (selected - 1);
            }
        }
      } else {
        let index = selected - dropdownPosition;

        if (dropdownPosition < 0) {
          index -= visibleItemCount;
        }

        index = Math.max(0, index);
        index = Math.min(index, itemCount - visibleItemCount);

        if (~selected) {
          offset = itemSize * index;
        }
      }
    }

    if (this.scroll) {
      this.scroll.scrollToOffset({offset, animated: false});
    }
  }

  updateRef(name, ref) {
    this[name] = ref;
  }

  keyExtractor(item, index) {
    let {valueExtractor} = this.props;

    return `${index}-${valueExtractor(item, index)}`;
  }

  renderBase(props) {
    let {value} = this.state;
    let {
      data,
      renderBase,
      labelExtractor,
      renderAccessory = this.renderAccessory,
    } = this.props;

    let index = this.selectedIndex();
    let title;

    if (~index) {
      title = labelExtractor(data[index], index);
    }

    if (title == null) {
      title = value;
    }

    if (typeof renderBase === 'function') {
      return renderBase({...props, title, value, renderAccessory});
    }

    title = title == null || typeof title === 'string' ? title : String(title);

    return (
      <View
        style={{
          width: !this.props.disabled ? '60%' : '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
            allowFontScaling={false}
          style={{
            textAlign: 'center',
            alignSelf: 'center',
            fontSize: 16,
            fontFamily: FONTS.SEMI_BOLD,
            color: COLORS.BLACK,
          }}>
          {title}
        </Text>
      </View>
    );
  }

  renderAccessory() {
    return <View />;
  }

  renderItem({item, index}) {
    if (item == null) {
      return null;
    }

    let {selected, leftInset, rightInset} = this.state;

    let {
      valueExtractor,
      labelExtractor,
      propsExtractor,
      textColor,
      baseColor,
      selectedItemColor = textColor,
      disabledItemColor = 'black',
      fontSize,
      itemTextStyle,
      rippleOpacity,
      rippleDuration,
      shadeOpacity,
      productDetailScreen,
    } = this.props;

    let props = propsExtractor(item, index);

    let {style, disabled} = (props = {
      rippleDuration,
      rippleOpacity,
      rippleColor: baseColor,

      shadeColor: baseColor,
      shadeOpacity,

      ...props,

      onPress: this.onSelect,
    });

    let value = valueExtractor(item, index);
    let label = labelExtractor(item, index);

    let padding = productDetailScreen ? '7%' : '3%';

    let title = label == null ? value : label;

    let color = disabled ? disabledItemColor : selectedItemColor;

    let fontFamily = index === selected ? FONTS.SEMI_BOLD : FONTS.REGULAR;
    let textStyle = {color, fontSize, fontFamily};

    props.style = [
      style,
      {
        // height: this.itemSize(),
        paddingLeft: leftInset,
        paddingRight: rightInset,
        paddingVertical: padding,
      },
    ];

    return (
      <DropdownItem index={index} {...props}>
        <Text allowFontScaling={false} style={[
            styles.item,
            itemTextStyle,
            textStyle,
            {paddingHorizontal: productDetailScreen ? 6 : 10},
          ]}
          numberOfLines={1}>
          {title}
        </Text>
      </DropdownItem>
    );
  }

  render() {
    let {
      renderBase,
      renderAccessory,
      containerStyle,
      labelContainerStyle,
      overlayStyle: overlayStyleOverrides,
      pickerStyle: pickerStyleOverrides,

      rippleInsets,
      rippleOpacity,
      rippleCentered,
      rippleSequential,

      hitSlop,
      pressRetentionOffset,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,

      supportedOrientations,

      ...props
    } = this.props;

    let {data, disabled, itemPadding, dropdownPosition, productDetailScreen} =
      props;

    let {left, top, width, opacity, selected, modal} = this.state;

    let itemCount = data.length;
    let visibleItemCount = this.visibleItemCount();
    let tailItemCount = this.tailItemCount();
    let itemSize = this.itemSize();

    let iosHeight;
    if (global.isiPhone7or8) {
      iosHeight = 1.35 * itemPadding + itemSize * visibleItemCount;
    } else {
      iosHeight = productDetailScreen
        ? 0.3 * itemPadding + itemSize * visibleItemCount
        : 0.5 * itemPadding + itemSize * visibleItemCount;
    }
    let androidHeight = productDetailScreen
      ? 1.9 * itemPadding + itemSize * visibleItemCount
      : 2.2 * itemPadding + itemSize * visibleItemCount;

    let height = Platform.OS === 'ios' ? iosHeight : androidHeight;

    let translateY = -itemPadding;

    if (dropdownPosition == null) {
      switch (selected) {
        case -1:
          translateY -= itemCount === 1 ? 0 : itemSize;
          break;

        case 0:
          break;

        default:
          if (selected >= itemCount - tailItemCount) {
            translateY -=
              itemSize * (visibleItemCount - (itemCount - selected));
          } else {
            translateY -= itemSize;
          }
      }
    } else {
    }

    let overlayStyle = {opacity};

    let pickerStyle = {
      width,
      // height,
      top,
      left,
      // transform: [{translateY}],
    };

    let touchableProps = {
      disabled,
      hitSlop,
      pressRetentionOffset,
      onPress: this.onPress,
      testID,
      nativeID,
      accessible,
      accessibilityLabel,
    };

    return (
      <View onLayout={this.onLayout} ref={this.updateContainerRef}>
        <TouchableOpacity
          activeOpacity={1}
          style={containerStyle}
          {...touchableProps}>
          {this.renderBase(props)}
          {!disabled ? renderAccessory() : null}
        </TouchableOpacity>

        <Modal
          visible={modal}
          transparent={true}
          onRequestClose={this.blur}
          supportedOrientations={supportedOrientations}>
          <Animated.View
            style={[styles.overlay, overlayStyle, overlayStyleOverrides]}
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.blur}>
            <View
              style={[styles.picker, pickerStyle, pickerStyleOverrides]}
              onStartShouldSetResponder={() => true}>
              <FlatList
                ref={this.updateScrollRef}
                data={data}
                // style={styles.scroll}
                renderItem={this.renderItem}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      borderBottomWidth: 1,
                      borderBottomColor: '#979797',
                    }}
                  />
                )}
                keyExtractor={this.keyExtractor}
                scrollEnabled={visibleItemCount < itemCount}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
              />
            </View>
          </Animated.View>
        </Modal>
      </View>
    );
  }
}
