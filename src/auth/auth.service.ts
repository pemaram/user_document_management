import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) return user;
    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
}