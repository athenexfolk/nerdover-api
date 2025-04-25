import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import type { User } from 'src/common/models/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() user: User) {
    return this.userService.create(user);
  }
}
