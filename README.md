# react-native-dial

Like a slider input, but round. For finer grained control over large ranges.

This component is 100% JS and compatible with both Android and iOS.

## props

* **minimumValue** - *PropTypes.number*: the minimum selectable value
* **maximumValue** -  *PropTypes.number*: the maximum selectable value
* **value** - *PropTypes.number*: the initial value
* **onValueChange** - *PropTypes.func*:
  Callback continuously called while the user is interacting with the component.
* **onSlidingBegin** - *PropTypes.func*:
  Callback called when the user begins interacting with the component. This is a
  good time to disable scrolling in a parent ScrollView.
* **onSlidingComplete** - *PropTypes.func*:
  Callback called when the user finishes changing the value (e.g. when the component is released).

## installation

`npm install react-native-dial --save`


## usage sample

**IMPORTANT** If you are using an older version of React-Native import from `react-native-dial/legacy` (instead of `react-native-dial`) because the React Native team changed the API for accessing the NativeMethodsMixin module and the static packager doesn't support fallback or dynamic paths for loading modules.

```
import React, { Component } from 'react';
import { AppRegistry, Text, View } from 'react-native';
import Dial from 'react-native-dial';

class SampleApp extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{this.state.value}</Text>

      	<Dial
      		style={{ width: 120, height: 120, marginBottom:30 }}
          maximumValue={3600}
          step={360/50}
          onValueChange={num=>this.setState({ value: num })}
      	/>

      </View>
    );
  }
}

AppRegistry.registerComponent('SampleApp', () => SampleApp);
```

## future enhancements

Pull requests are welcome.

* add animated gif of example to readme
* set step value like in Slider control
* set range of 1 revolution
* don't allow oversliding more than 1 revolution past min/max
* add `mode` prop to swap between 'dial' and 'circular-slider'
  * maybe allow custom renderer?
* ability to customize styles
* more native looking default styles for android?
