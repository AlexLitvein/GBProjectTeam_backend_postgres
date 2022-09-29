import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from '@App/auth/auth.controller';
import { AuthService } from '@App/auth/auth.service';
import { JwtStrategy } from '@App/auth/strategy';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
