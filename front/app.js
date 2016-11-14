/**
 * Created by pavluhin on 10.11.2016.
 */

import './sass/main.scss';
import {con} from './js/itest';
import 'babel-polyfill'
import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'



var ID;


class App extends Component {
    render() {
        return <div>Привет из App</div>
    }
}

React.render(<App />,
    document.getElementById('root')
)


con();
// window.onload = function() {
//
//     console.log('load');
//     var socket = io.connect('http://localhost:8888');
//
//     socket.on('connect', function () {
//         console.log('connect');
//         socket.on('message', function (msg) {
//             // Добавляем в лог сообщение, заменив время, имя и текст на полученные
//             document.querySelector('body').innerHTML = msg.name;
//             ID=msg.id;
//         });
//     });
// };