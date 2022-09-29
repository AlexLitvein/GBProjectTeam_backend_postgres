import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '@App/auth/decorator/get-user.decorator';
import { JwtGuard } from '@App/auth/guard';
import { EditUserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    // console.log({
    //   user: req.user,
    // });
    return user;
  }
  @Patch()
  editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    console.log({
      userId: userId,
      dto: dto,
    });
    return this.userService.editUser(userId, dto);
  }
}
