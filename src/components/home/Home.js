import Template from '../Template';
import html from './home.html';
import './home.css';

const template = new Template(html);

export default class Home {

  render() {
    return template.clone();
  }

  unrender() {
    // no-op
  }
}