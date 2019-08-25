import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private tokenService: TokenService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public async login(authForm: NgForm) {
    const emailControl = authForm.controls.email;
    const passwordControl = authForm.controls.password;

    if (emailControl.invalid || passwordControl.invalid) {
      this.toastr.error('Preencha o formulário corretamente', 'Erro');
      return;
    }

    const email: string = emailControl.value;
    const password: string = passwordControl.value;

    let token;
    try {
      const response = await this.authService.login(email, password);
      token = (response as any).token;
    } catch (error) {
      const { status }: { status: number } = error;

      let message = 'Houve um erro ao logar';
      switch (status) {
        case 404:
          message = 'Usuário não encontrado ou senha incorreta';
          break;
      }
      this.toastr.error(message, 'Erro');
      return;
    }

    this.tokenService.setToken(token);
    this.router.navigate(['']);
  }

  public async register(authForm: NgForm) {
    if (authForm.invalid) {
      this.toastr.error('Preencha o formulário corretamente', 'Erro');
      return;
    }

    const email: string = authForm.controls.email.value;
    const password: string = authForm.controls.password.value;
    const confirmPass: string = authForm.controls.confirmPass.value;

    if(password !== confirmPass){
      this.toastr.error('As senhas precisam ser iguais', 'Erro');
      return;
    }

    let token;
    try {
      const response = await this.authService.register(email, password);
      token = (response as any).token;
    } catch (error) {
      const { status }: { status: number } = error;

      let message = 'Houve um erro ao logar';
      switch (status) {
        case 404:
          message = 'Usuário não encontrado ou senha incorreta';
          break;
        case 409:
          message = 'Já existe um usuário com esse email';
      }

      this.toastr.error(message, 'Erro');
      return;
    }

    this.tokenService.setToken(token);
    this.router.navigate(['']);
  }
}
