import {Component, Inject, OnInit} from '@angular/core';
import {
  AlertController, IonicPage, ItemSliding, LoadingController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import {Dish} from "../../shared/dish";
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {Storage} from "@ionic/storage";
import {DishProvider} from "../../providers/dish/dish";

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
              private dishservice: DishProvider,
              private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              @Inject('BaseURL') private BaseURL2,
              private storage: Storage,
              public navParams: NavParams) {
    this.BaseURL = this.BaseURL2;
  }

  ngOnInit() {
    //this.storage.get('favorites').then(favorites=>{
      this.dishservice.getFavoriteDishes()
        .subscribe(favorites => {
          this.favorites = favorites;
        }, error => this.errmsg = error);
    //});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritesPage');
  }

  getImg(cat){
    var img;
    if(cat=='1'){
      img = "http://www.newsapp.io/uiimages/seo_.JPG";
    }
    else if(cat=='2'){
      img = "http://www.newsapp.io/uiimages/sem_.JPG";
    }
    else if(cat=='3'){
      img="http://www.newsapp.io/uiimages/analytics_.jpg";
    }
    else if(cat=='4'){
      img="http://www.newsapp.io/uiimages/cm_.jpg";
    }
    else if(cat=='5'){
      img="http://www.newsapp.io/uiimages/mobile_.JPG";
    }
    else if(cat=='6'){
      img="http://www.newsapp.io/uiimages/smm_.jpg";
    }
    else if(cat=='7'){
      img="http://www.newsapp.io/uiimages/adwords_.jpg";
    }
    else if(cat=='8'){
      img="http://www.newsapp.io/uiimages/fb_.jpg";
    }
    else if(cat=='9'){
      img="http://www.newsapp.io/uiimages/india_.jpg";
    }
    else if(cat=='10'){
      img="http://www.newsapp.io/uiimages/international_.jpg";
    }
    else if(cat=='11'){
      img="http://www.newsapp.io/uiimages/freelancing_.jpg";
    }
    else if(cat=='12'){
      img="http://www.newsapp.io/uiimages/ai_.JPG";
    }
    else if(cat=='13'){
      img="http://www.newsapp.io/uiimages/startups_.jpg";
    }
    else{
      img="http://www.newsapp.io/uiimages/dmt_.jpg";
    }
    return img;
  }

  deleteFavorite(slidingItem: ItemSliding, dish: any) {
    var id = dish._id;
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
            this.dishservice.deleteFavorite(id, 'siddharthsogani22@gmail.com')
              .subscribe(favorites => {
                  let index = this.favorites.indexOf(dish);

                  if(index > -1){
                    this.favorites.splice(index, 1);
                  }
                  loading.dismiss();
                  toast.present();
                  slidingItem.close();
                } ,
                errmess =>{
                  this.errmsg = errmess; loading.dismiss();

                });
          }
        }
      ]
    });

    alert.present();

  }

}
