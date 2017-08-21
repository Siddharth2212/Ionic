import {Component, Inject, OnInit} from '@angular/core';
import {
  AlertController, IonicPage, ItemSliding, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {Dish} from "../../shared/dish";
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {Storage} from "@ionic/storage";

/**
 * Generated class for the FavoritesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favorites',
  templateUrl: 'favorites.html',
})
export class FavoritesPage implements OnInit{
  favorites: Dish[];
  errmsg: string;
  BaseURL;

  constructor(public navCtrl: NavController,
              private favoriteservice: FavoriteProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              @Inject('BaseURL') private BaseURL2,
              private storage: Storage,
              public navParams: NavParams) {
    this.BaseURL = this.BaseURL2;
  }

  ngOnInit() {
    this.storage.get('favorites').then(favorites=>{
      this.favoriteservice.getFavorites(favorites)
        .subscribe(favorites => {
          this.favorites = favorites;
        }, error => this.errmsg = error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  deleteFavorite(item: ItemSliding, id: number) {
    console.log('delete', id);

    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete Dish '+ id,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Deleting . . .'
            });
            let toast = this.toastCtrl.create({
              message: 'Dish ' + id + ' deleted successfully',
              duration: 3000});
            loading.present();
            this.storage.get('favorites').then(favorites=>{
              this.favoriteservice.deleteFavorite(id, favorites)
                .subscribe(favorites => {
                  var favoritesIds = favorites.map(function (dish) {
                    return dish['id'];
                  });
                  this.storage.set('favorites', favoritesIds);
                  loading.dismiss();
                  toast.present();
                  item.close();
                  } ,
                  errmess =>{
                  this.errmsg = errmess; loading.dismiss();

                });
            });
          }
        }
      ]
    });

    alert.present();

  }

}
