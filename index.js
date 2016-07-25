'use strict';
import React, { PropTypes, Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  PanResponder
} from 'react-native';
const nativeMethodsMixin = require('NativeMethodsMixin');
  
const CircularSlider = React.createClass({
  getInitialState: function() {
    return {
  		angle: this.props.value,
  		constrainedAngle: 0,
  		previousAngle: 0,
  		active: false
		};
  },
  componentWillMount: function() {
    const endGesture = (evt, gestureState) => {
      this.setState({
        active: false,
        angle: this.state.constrainedAngle,
        previousAngle: this.state.constrainedAngle % 360
      });
      if(this.props.onSlidingComplete) {
        this.props.onSlidingComplete(this.state.constrainedAngle);
      }
    };

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderGrant: () => this.setState({active: true}),
      onPanResponderMove: (evt, gestureState) => {
        const point = {
          x: evt.nativeEvent.pageX - (this.layout.pageX + this.layout.width / 2),
          y: evt.nativeEvent.pageY - (this.layout.pageY + this.layout.height / 2)
        };
        const currentAngle = getAngleDeg({x: 0, y: -1}, point);
        const newAngle = this.state.angle + getAngleDiff(this.state.previousAngle, currentAngle);
        const constrainedAngle = getConstrainedAngle(newAngle, this.props);
        this.setState({
          angle: newAngle,
          previousAngle: currentAngle,
          constrainedAngle: constrainedAngle
        });
    		if(this.props.onValueChange) {
 	      	this.props.onValueChange(constrainedAngle);
        }

        function getAngleDiff(deg1, deg2) {
          const diff = deg2 - deg1;
          if(diff < -180) {
            return diff + 360;
          }
          if(diff > 180) {
            return diff - 360;
          }
          return diff;
        }

        function getConstrainedAngle(angle, {minimumValue, maximumValue}) {
          return Math.max(Math.min(angle, maximumValue), minimumValue);
        }

        function getAngleDeg(v1, v2) {
          let deg = Math.atan2(v2.y - v1.y, v2.x - v1.x) * 180 / Math.PI + 90;
          return deg < 0 ? deg + 360 : deg;
        }
      },
      onPanResponderRelease: endGesture,
      onPanResponderTerminate: endGesture
    });
  },
  componentDidMount() {
    this.measure = nativeMethodsMixin.measure;
    requestAnimationFrame(()=>
      this.measure((x, y, width, height, pageX, pageY) => {
        this.layout = {x, y, width, height, pageX, pageY};
        console.log(this.layout);
      }));
  },
  render: function() {
    const {trackWidth = 3, handleDiameter = 28} = this.props;
    const defaultSize = 180;
    let size = this.state.size ? Math.min(this.state.size.width, this.state.size.height) : 0;
    if(this.state.size && size === 0) {
      size = defaultSize;
    }
    size -= handleDiameter;
    const handleColor = '#FFF';

    const handleStyle = {
      width: handleDiameter,
      height: handleDiameter,
      borderRadius: handleDiameter/2,
      backgroundColor: handleColor,
      shadowColor: "black",
      shadowOpacity: 0.6,
      shadowRadius: 1.5,
      shadowOffset: {
        height: 1,
        width: 0
      },
      left: size/2 - handleDiameter/2 - trackWidth,
      top: -1*handleDiameter/2 - trackWidth/2,
      transform: [{
        rotate: (360 - this.state.constrainedAngle % 360) + 'deg'
      }]
    };

    return (
      <View style={this.props.style} onLayout={evt=>this.setState({size:evt.nativeEvent.layout})}>
      	{size ?
          <View style={{
         			margin: handleDiameter/2,
              width: size,
              height: size,
              borderRadius: size/2,
              borderWidth: trackWidth,
              borderColor: this.state.active ? '#DDD' : '#CCC',
              transform: [{
                rotate:  this.state.constrainedAngle % 360 + 'deg'
              }]
            }}
            onLayout={layout=>this._layout = layout.nativeEvent.layout}
            >
            <View style={handleStyle}
              {...this._panResponder.panHandlers}/>
          </View>
      	: null }
     	</View>
    );
  }
});
CircularSlider.propTypes = {
	minimumValue: PropTypes.number,
  maximumValue: PropTypes.number,
  value: PropTypes.number,
  onValueChange: PropTypes.func,
  onSlidingComplete: PropTypes.func
};
CircularSlider.defaultProps = {
	minimumValue: -360,
  maximumValue: Number.MAX_VALUE,
  value: 0
};

export default CircularSlider;
