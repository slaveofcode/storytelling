import _ from 'lodash'
import './css/style.css'
import Me from './media/me.jpg'
import printMe from './modules/print'

function component() {
  var element = document.createElement('div');

  element.innerHTML = _.join(['welcome', 'to', 'my world', 'hahaha', 'test'], ' ');
  element.classList.add('head')

  const me = new Image()
  me.src = Me

  element.appendChild(me)

  printMe()

  return element;
}

document.body.appendChild(component());