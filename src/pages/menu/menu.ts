import {Component, Inject, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {DishProvider} from "../../providers/dish/dish";
import {Dish} from "../../shared/dish";
import {DishdetailPage} from "../dishdetail/dishdetail";
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the MenuPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage implements OnInit{
  dishes: Dish[];
  errMess: String;
  BaseURL;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private dishservice: DishProvider,
              private toastCtrl: ToastController,
              private storage: Storage,
              private favoriteservice: FavoriteProvider,
  @Inject('BaseURL') private BaseURL2) {
    this.BaseURL = this.BaseURL2;
  }

  ngOnInit(){
    this.dishservice.getDishes()
      .subscribe(dishes => this.dishes = dishes, errmess => this.errMess = errmess);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  dishSelected(event, dish) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(DishdetailPage, {
      dish: dish
    });
  }

  addToFavorites(dish: Dish) {
    console.log('Adding to Favorites', dish.id);
    this.storage.get('favorites').then(favorites => {
      this.favoriteservice.addFavorite(dish.id, favorites);
    });
    this.toastCtrl.create({
      message: 'Dish ' + dish.id + ' added as a favorite successfully',
      duration: 3000
    }).present();
  }

}
