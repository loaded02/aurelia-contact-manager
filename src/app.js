import {inject} from 'aurelia-framework';
import {WebAPI} from './web-api';

@inject(WebAPI)
export class App {
  movie = {title: '', director: ''} // Quentin Tarantino, Attack on titan
  movies = []
  
  constructor(api) {
    this.api = api;
  }
  
  configureRouter(config, router) {
    config.title = 'Contacts';
    config.map([
      { route: '',              moduleId: 'no-selection',   title: 'Select'},
      { route: 'contacts/:id',  moduleId: 'contact-detail', name:'contacts' }
    ]);
    
    this.router = router;
  }
  
  onSubmit() {
    this.api.getMovies(this.movie.director, this.movie.title)
      .then(response => {
        this.movies.splice(0);
        if (response.hasOwnProperty('errorcode')) {
          this.movies.push({show_title: response.errorcode, director: response.message})
        } else {
          if (Array.isArray(response))
            this.movies.push(...response);
          else
            this.movies.push(response);
        }
      })
  }
  
  delete(input) {
    if (input === 'title') {
      this.movie.title = '';
    } else {
      this.movie.director = '';
    }
  }
}
