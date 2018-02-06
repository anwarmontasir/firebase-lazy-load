import html from './user.html';
import Template from '../../Template';
import { auth } from '../../../services/firebase';

const template = new Template(html);

export default class User {

  render() {
    const dom = template.clone();
    const user = auth.currentUser;
    
    const splitName = user.displayName.split(' ');
    dom.querySelector('.user-name').textContent = `Hello, ${splitName[0]}`;
    
    dom.querySelector('.sign-out').addEventListener('click', () => {
      auth.signOut();
    });

    return dom;
  }
}