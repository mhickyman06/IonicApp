import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertController, IonicModule, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginModel } from '../model/LoginModel';
// import { AuthenticationService } from '../services/authentication.service';
import { Observable, catchError, first, map, observable } from 'rxjs';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { error } from 'console';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,ReactiveFormsModule,HttpClientModule]
})
export class LoginPage implements OnInit {

  public isError = false;
  public isClicked = false;
  public isLoading = false;
  public ischecked = false;
  public errorHead:any =""
  public passwordError =[""]
  public usernameError =[""]

  constructor(
    private route:ActivatedRoute,
    private http:HttpClient,
    private alertctrl:AlertController,
    private loadingctrl:LoadingController ,
    private router:Router) { }


  ngOnInit() {
    let logindata:FormGroup
    logindata = new FormGroup({
      username: new FormControl("",[Validators.required]),
      password: new FormControl("",[Validators.required]),
      rememberMe: new FormControl("")  
    });  
  }

  logindata = new FormGroup({
    username: new FormControl("",[Validators.required]),
    password: new FormControl("",[Validators.required]),
    rememberMe: new FormControl("")
  })

  get username(){
    return this.logindata.get('username');
  }

  get password(){
    return this.logindata.get('password');
  }
  doAction(event:any){
    this.ischecked = event.target.checked;
  }
  
  async submit(data:any){

    const loading = await this.loadingctrl.create({message:"Processing....."});
    await   loading.present();
    
     var logindata:LoginModel = {
      Username:data.value.username,
      Password: data.value.password, 
      isPersistent:this.ischecked
    }  
   
    console.log(logindata);  
    this.login(logindata).subscribe(
      async (token)=>{
        localStorage.setItem("token",JSON.stringify(token));
        loading.dismiss();
      },
      async (error)=>{       
        const alert =await this.alertctrl.create({message:"Login Failed",buttons:["ok"]});    
        await alert.present();
        loading.dismiss();    
      }
    )
  }
    login(logindata:any):Observable<string>{
      return  this.http.post<{token:string}>(
        environment.api_Url+"api/Authentication/Login",logindata)
        .pipe(map(response=>response.token));
    }  
}
