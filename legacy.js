'use strict';
/*
NOTE: This file is here to support older versions of react native where NativeMethodsMixin
is not available from 'react/lib/NativeMethodsMixin'
*/
import createDialComponent from './Dial.js';
export createDialComponent(require('NativeMethodsMixin'));
