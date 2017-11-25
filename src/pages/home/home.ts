import {Component, OnInit, Inject, ViewChild} from '@angular/core';
import {LoadingController, NavController, Slides, ToastController} from 'ionic-angular';
import {Dish} from '../../shared/dish';
import {DishProvider} from '../../providers/dish/dish';
import {Promotion} from '../../shared/promotion';
import {PromotionProvider} from '../../providers/promotion/promotion';
import {Leader} from '../../shared/leader';
import {LeaderProvider} from '../../providers/leader/leader';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  @ViewChild(Slides) slides: Slides;

  public selectedCategory;
  public categories: Array<any>;
  public showLeftButton: boolean;
  public showRightButton: boolean;
  dishes: any;
  promotion: Promotion;
  leader: Leader;
  dishErrMsg: String;
  promoErrMsg: String;
  leaderErrMsg: String;
  BaseURL: String;

  constructor(public navCtrl: NavController,
  private dishservice: DishProvider,
  private promotionservice: PromotionProvider,
  private leaderservice: LeaderProvider,
  private loadingCtrl: LoadingController,
  private toastCtrl: ToastController,
  @Inject('BaseURL') private BaseURL2) {

  }

  private initializeCategories(): void {

    // Select it by defaut
    this.selectedCategory = this.categories[0];

    // Check which arrows should be shown
    this.showLeftButton = false;
    this.showRightButton = this.categories.length > 3;
  }

  public filterData(categoryId: number): void {
    // Handle what to do when a category is selected
  }

  // Method executed when the slides are changed
  public slideChanged(): void {
    let currentIndex = this.slides.getActiveIndex();
    this.showLeftButton = currentIndex !== 0;
    this.showRightButton = currentIndex !== Math.ceil(this.slides.length() / 3);
  }

  // Method that shows the next slide
  public slideNext(): void {
    this.slides.slideNext();
  }

  // Method that shows the previous slide
  public slidePrev(): void {
    this.slides.slidePrev();
  }

  isFavorite(item){
    if (item.favorites.indexOf('siddharthsogani1@gmail.com') !== -1) {
      return true;
    }
    else{
      return false;
    }
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

  timeSince(date) {
    var u1 = +new Date();
    var u2 = +new Date(date);
    var seconds = Math.floor((u1 - u2) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

  getHostName(url, item) {
  if (typeof url == 'undefined') {
    url = item.link;
  }
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
  } else {
    return null;
  }
}
  extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

getDishLink(dish){
  var url = dish.link;
  var urlParts = url.split('url=');
  return (typeof dish.added!='undefined' && dish.added == 'true') ? this.extractHostname(dish.link) : this.getHostName(urlParts[1], dish)
}

addToFavorites(dish){
  let loading = this.loadingCtrl.create({
    content: 'Deleting . . .'
  });
  let toast = this.toastCtrl.create({
    message: 'Dish ' + dish._id + ' added to Favorites',
    duration: 3000});
  loading.present();
  this.dishservice.addToFavorites(dish._id, 'siddharthsogani22@gmail.com')
    .subscribe(favorites => {
        loading.dismiss();
        toast.present();
        this.isFavorite(dish) == true;
      } ,
      errmess =>{
        this.dishErrMsg = errmess;
        loading.dismiss();
      });
}

  getFavIcon(dish){
  if(this.isFavorite(dish)){
    return 'heart';
  }
  else{
return 'heart-outline';
  }
  }

  ngOnInit(){
  this.selectedCategory = {id: 1, name: 'Cat1'};

    var catArray = ['Home', 'SEO', 'SEM', 'Analytics', 'Content Marketing', 'Mobile', 'Social Media Marketing', 'Google Adwords', 'Facebook', 'India Jobs', 'International Jobs', 'Freelancing Jobs', 'AI/Machine Learning', 'Startups', 'Digital Marketing Tips'];
    this.categories = [];
    for(var i =0; i<catArray.length; i++){
      this.categories.push({id:i, name:catArray[i]});
    }
    this.BaseURL = this.BaseURL2;
    this.dishservice.getDishes()
      .subscribe(dishes =>  {this.dishes = dishes; console.log('____'); console.log(dishes);}, errmess => this.dishErrMsg = <any>errmess);
  }

}
