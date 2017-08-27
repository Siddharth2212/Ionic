import {
  ActionSheetController, AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams,
  ToastController
} from 'ionic-angular';
import { Component, Inject } from '@angular/core';
import { Dish } from '../../shared/dish';
import {FavoriteProvider} from "../../providers/favorite/favorite";
import {CommentPage} from "../comment/comment";
import {Storage} from "@ionic/storage";
import {SocialSharing} from "@ionic-native/social-sharing";

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  numcomments: number;
  avgstars: String;
  favorite: boolean = false;
  BaseURL: string;

  constructor(public navCtrl: NavController,
              private favoriteservice: FavoriteProvider,
              public navParams: NavParams,
              private toastCtrl: ToastController,
              private actionSheetCtrl: ActionSheetController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController,
              private socialSharing: SocialSharing,
              private storage: Storage,
              @Inject('BaseURL') private BaseURL2) {
    this.BaseURL = this.BaseURL2;
    this.dish = navParams.get('dish');
    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total+= comment.rating);
    this.avgstars = (total/this.numcomments).toFixed(2);
    this.storage.get('favorites').then(favorites => {
      this.favorite = this.favoriteservice.isFavorite(this.dish.id, favorites);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.storage.get('favorites').then(favorites=>{
      this.favorite = this.favoriteservice.addFavorite(this.dish.id, favorites);
    });
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }

  deleteFavorite() {
    console.log('delete', this.dish.id);

    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want to delete Dish '+ this.dish.id,
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
              message: 'Dish ' + this.dish.id + ' deleted successfully',
              duration: 3000});
            loading.present();
            this.storage.get('favorites').then(favorites=>{
              this.favoriteservice.deleteFavorite(this.dish.id, favorites)
                .subscribe(favorites => {
                    var temp = favorites.map(function (dish) {
                      return dish['id'];
                    });
                    this.storage.set('favorites', temp);
                    this.favorite = false;
                    loading.dismiss();
                    toast.present(); } ,
                  errmess =>{
                  });
            });
          }
        }
      ]
    });

    alert.present();

  }

  openActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            let modal = this.modalCtrl.create(CommentPage);
            modal.onDidDismiss(comment => {
              this.dish.comments.push(comment);
            });
            modal.present();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Facebook'))
              .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
              .then(() => console.log('Posted successfully to Twitter'))
              .catch(() => console.log('Failed to post to Twitter'));
          }
        }
      ]
    });

    actionSheet.present();
  }
}
