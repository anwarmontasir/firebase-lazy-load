import Template from '../Template';
import html from './app.html';
import './app.css';
import Header from './header/Header';
import Login from '../auth/Login';
// import Register from '../auth/Register';
import Home from '../home/Home.js';
import Pets from '../pets/Pets.js';
import { auth } from '../../services/firebase';
import { removeChildren } from '../dom';

const template = new Template(html);

const map = new Map();
map.set('#login', { Component: Login, isPublic: true });
// map.set('#register', { Component: Register, isPublic: true });
map.set('#pets', { Component: Pets, isPublic: false });

const homepage = { Component: Home, isPublic: true };

export default class App {

  constructor() {
    this.hashChange = () => this.setPage();
    window.addEventListener('hashchange', this.hashChange);

    let authed = false;

    auth.onAuthStateChanged(user => {
      // store so we can refer to current user in the setPage method
      this.user = user;

      // sometimes page routing can load before firebase fires this event.
      // Issue here, is we want to know if we have user or not _before_ we load
      // the current page;
      if(!authed) {
        authed = true;  
        this.setPage();
      }  

      // if no user, make sure we are on a public page
      if(!user && !this.page.isPublic) {
        window.location.hash = '#';
      }
    });
  }

  setPage() {
    const { hash } = window.location;
    const routes = hash.split('/');
    const route = routes[0];
    // if we are already at this top-level page, no need to transition
    // ( could be a subroute change: #pets --> #pets/123 )
    if(this.page && route === this.page.route) return;

    // unrender the prior component and clear from dom:
    if(this.page && this.page.component) this.page.component.unrender();
    removeChildren(this.main);

    // get the new component info from the map.
    const { Component, isPublic } = map.get(route) || homepage;
    
    let component = null;

    if(!isPublic && !this.user) {
      window.location.hash = `#auth/${encodeURIComponent(hash)}`;
    }
    else {
      // create the component instance
      component = new Component();
      // assign new stuff as the current component instance
      this.page = { route, component, isPublic };
      // add the new component's dom via render()
      this.main.appendChild(component.render());
    }

  }

  render() {
    const dom = template.clone();

    dom.querySelector('header').appendChild(new Header().render());
    this.main = dom.querySelector('main');

    // don't set page here, wait for auth to make it happen

    return dom;
  }

  unrender() {
    window.removeEventListener('hashchange', this.hashChange);
  }
}