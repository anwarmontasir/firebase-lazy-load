import html from './header.html';
import './header.css';
import Template from '../../Template';
import User from './User';
import { auth } from '../../../services/firebase';
import { removeChildren } from '../../dom';

const template = new Template(html);

export default class Header {

  render() {
    const dom = template.clone();

    // collapse nav on link click
    const mainNav = dom.querySelectorAll('#main-nav ul li a');
    const burger = dom.querySelector('#burger');

    mainNav.forEach(link => {
      link.addEventListener('click', () => {
        burger.checked = false;
      });
    });

    const userNav = dom.querySelector('#user-nav');

    auth.onAuthStateChanged(user => {
      removeChildren(userNav);

      let child = null;

      if(user) {
        child = new User().render();
      } else {
        const newElements = [
          {textContent: 'Log In', href: '#login'},
          {textContent: 'Register', href: '#register'}
        ];
        newElements.forEach(elem => {
          child = document.createElement('a');
          child.textContent = elem.textContent;
          child.href = elem.href;
          userNav.appendChild(child);
        });
      }
      
    });
    return dom;
  }
}