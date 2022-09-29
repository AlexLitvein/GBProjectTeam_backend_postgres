import {
  Controller,
  Post,
  Req,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from '@App/auth/auth.service';
import { AuthDto } from '@App/auth/dto';

@Controller('auth') // маршрут
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup') // конечн точка
  signup(@Body() dto: AuthDto) {
    // console.log({
    //   email,
    //   passcode,
    // });
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
