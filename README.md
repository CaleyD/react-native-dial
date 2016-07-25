# react-native-circular-slider

Like a slider input, but round. For finer grained control over large ranges.

## props

* **minimumValue** - *PropTypes.number*: the minimum selectable value
* **maximumValue** -  *PropTypes.number*: the maximum selectable value
* **value** - *PropTypes.number*: the initial value
* **onValueChange** - *PropTypes.func*:
  Callback continuously called while the user is interacting with the component.
* **onSlidingComplete** - *PropTypes.func*:
  Callback called when the user finishes changing the value (e.g. when the component is released).

## installation

`npm install react-native-circular-slider --save`

## sample usage

```
import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';
import CircleSlider from 'react-native-circular-slider'

class SampleApp extends Component {
  constructor(props) {
    super(props);
    this.state = {value: 0};
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{this.state.value}</Text>

      	<CircularSlider
      		style={{width: 120, height: 120, marginBottom:30}}
          maximumValue={3600}
          step={360/50}
          onValueChange={num=>this.setState({value: num})}
      	/>

      </View>
    );
  }
}

AppRegistry.registerComponent('SampleApp', () => SampleApp);
```
