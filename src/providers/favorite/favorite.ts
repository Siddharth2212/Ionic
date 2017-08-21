import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {DishProvider} from "../dish/dish";
import {Observable} from "rxjs/Observable";
import {Dish} from "../../shared/dish";
import {Storage} from "@ionic/storage";

/*
  Generated class for the FavoriteProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class FavoriteProvider {
  favorites: Array<any>;

  constructor(public http: Http, private dishservice: DishProvider, private storage: Storage) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
  }

  addFavorite(id: number, favorites: number[]): boolean {
    if(!this.isFavorite(id, favorites)){
      this.favorites.push(id);
      //this.storage.remove('favorites');
      this.storage.get('favorites').then(favorites=>{
        if(favorites == null || typeof favorites == 'undefined'){
          var temp = [];
          temp.push(id);
          this.storage.set('favorites', temp);
        }
        else{
          favorites.push(id);
          this.storage.set('favorites', favorites);
        }
      });
      return true;
    }
  }

  isFavorite(id: number, favorites: number[]): boolean{
    if(favorites == null || typeof favorites == 'undefined'){
      return false;
    }
    else{
      return favorites.some(el => el === id);
    }
  }

  getFavorites2() : Observable<Dish[]>{
    return this.dishservice.getDishes()
      .map(dishes => dishes.filter(dish => this.favorites.some(el => el == dish.id)))
  }

  getFavorites(favorites: number[]) : Observable<Dish[]>{
    return this.dishservice.getDishes()
      .map(dishes => dishes.filter(dish => favorites.some(el => el == dish.id)))
  }

  deleteFavorite(id: number, favorites: number[]) : Observable<Dish[]> {
    let index = favorites.indexOf(id);
    console.log('INDEX____'+index);
    console.log(id);
    console.log(favorites);
    if (index !== -1 ) {
      favorites.splice(index,1);
      this.storage.set('favorites', favorites);
      return this.getFavorites(favorites);
    }
    else {
      console.log('Deleting non-existant favorite', id);
      return Observable.throw('Deleting non-existant favorite' + id);
    }
  }

}
