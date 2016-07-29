'use strict';
import React, { PropTypes, Component } from 'react';
import { View, PanResponder } from 'react-native';

//
// It would be great if we didn't need to use NativeMethodsMixin.measure but
// unfortunately the onLayout functionality does not supploy pageX and pageY
// coordinates and the PanResponder can return x,y coordinates that are relative
// to a child component rather than the component that the pan responder is attached to
//
// We could probably hack out a solution that works with nested views and
// layouts...

export default function CreateDialComponent(NativeMethodsMixin) {

  const Dial = React.createClass({
    mixins: [NativeMethodsMixin],
    getInitialState: function() {
      return this.getStateForValue(this.props.value);
    },
    componentWillReceiveProps(nextProps) {
      if(this.props.value !== nextProps.value) {
        this.setState(this.getStateForValue(nextProps.value))
      }
    },
    getStateForValue(value) {
      return {
        angle: value,
        previousAngle: value % 360,
        active: false
      };
    },
    getConstrainedAngle(angle) {
      return Math.max(
        Math.min(angle, this.props.maximumValue),
        this.props.minimumValue
      );
    },
    componentWillMount: function() {
      const endGesture = (evt, gestureState) => {
        const constrainedAngle = this.getConstrainedAngle(this.state.angle);
        this.setState({
          active: false,
          angle: constrainedAngle,
          previousAngle: constrainedAngle % 360
        });
        if(this.props.onSlidingComplete) {
          this.props.onSlidingComplete(constrainedAngle);
        }
      };

      this._panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderTerminationRequest: (evt, gestureState) => false, // false because of scrollview nesting issue
        onShouldBlockNativeResponder: (evt, gestureState) => true,
        onPanResponderGrant: () => {
          this.updateLayout();
          this.setState({ active: true });
          if(this.props.onSlidingBegin) {
            this.props.onSlidingBegin();
          }
        },
        onPanResponderMove: (evt, gestureState) => {
          this.updateLayout(); // this is here because of annoying issues when nested in a scrollview
          const point = {
            x: evt.nativeEvent.pageX - (this.layout.pageX + this.layout.width / 2),
            y: evt.nativeEvent.pageY - (this.layout.pageY + this.layout.height / 2)
          };
          const currentAngle = getAngleDeg({x: 0, y: -1}, point);
          const newAngle = this.state.angle + getAngleDiff(this.state.previousAngle, currentAngle);
          const constrainedAngle = this.getConstrainedAngle(newAngle);
          this.setState({
            angle: newAngle,
            previousAngle: currentAngle
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
      requestAnimationFrame(()=>this.updateLayout());
    },
    updateLayout: function() {
      this.measure((x, y, width, height, pageX, pageY) => {
        this.layout = {x, y, width, height, pageX, pageY};
        console.log(this.layout);
      });
    },
    render: function() {
      const {style, trackWidth = 3, handleDiameter = 28} = this.props;
      const {active, angle} = this.state;
      const constrainedAngle = this.getConstrainedAngle(angle);
      const defaultSize = 180;
      const size = this.state.size ?
        Math.min(this.state.size.width, this.state.size.height) - handleDiameter :
        defaultSize - handleDiameter;
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
          rotate: (360 - constrainedAngle % 360) + 'deg'
        }]
      };

      return (
        <View style={style} onLayout={evt=>this.setState({size:evt.nativeEvent.layout})}>
        	{size ?
            <View style={{
           			margin: handleDiameter / 2,
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: trackWidth,
                borderColor: active ? '#DDD' : '#CCC',
                transform: [{
                  rotate: constrainedAngle % 360 + 'deg'
                }]
              }}
              >
              <View style={handleStyle} {...this._panResponder.panHandlers}/>
            </View>
        	: null }
       	</View>
      );
    }
  });
  Dial.propTypes = {
  	minimumValue: PropTypes.number,
    maximumValue: PropTypes.number,
    value: PropTypes.number,
    onValueChange: PropTypes.func,
    onSlidingComplete: PropTypes.func,
    onSlidingBegin: PropTypes.func
  };
  Dial.defaultProps = {
  	minimumValue: -360,
    maximumValue: Number.MAX_VALUE,
    value: 0
  };

  return Dial;
}
