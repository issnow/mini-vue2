import App from './App1.js';
import {createApp} from '../../lib/guide-mini-vue.esm.js'

const rootContainer = document.querySelector('#app')
createApp(App).mount(rootContainer)