import Signal from './signal.js'

export default class Cell {

  emit() { return new Signal() }

  detect(signal) { }
}