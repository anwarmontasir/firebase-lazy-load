import Template from '../Template';
import html from './login.html';
import './auth.css';
import { auth, providers } from '../../services/firebase';


const template = new Template(html);

export default class Login {

  constructor() {

  }
  handleToggleShowPassword(showPassword) {
    const type = password.type;
    password.type = type === 'password' ? 'text' : 'password';
    showPassword.textContent = type === 'password' ? 'Hide' : 'Show';
  }

  render() {
    const dom = template.clone();
    this.showPassword = dom.querySelector('.show-password');
    this.showPassword.addEventListener('click', () => this.handleToggleShowPassword(this.showPassword));
    return dom;
  }

  unrender() {
    // no-op
  }
}