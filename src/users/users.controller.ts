// src/users/users.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('register')
  @Roles('admin')
  create(@Body() userDTO: CreateUserDto) {
    return this.userService.create(userDTO);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.userService.findAll();
  }
}
