import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { User } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/common/enum/user.role.enum';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() dto: LoginDto) {
    return await this.auth.login(dto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@GetUser() user: any) {
    return this.auth.logout(user._id.toString());
  }

  @Post('send-otp')
  @Public()
  async sendOtp(@Body('email') email: string) {
    return await this.auth.sendOtp(email);
  }

  @Post('verify-otp')
  @Public()
  async verifyOtp(@Body() body: { email: string; otp: string }) {
    return await this.auth.verifyOtp(body.email, body.otp);
  }

  @Post('reset-password')
  @Public()
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.auth.resetPassword(dto);
  }

  @Post('refresh')
  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req) {
    try {
      if (!req.user || !req.user.sub) {
        throw new UnauthorizedException('Invalid user information in token');
      }
      return await this.auth.refresh(req.user.sub, req.user.refreshToken);
    } catch (error) {
      // Log the error for debugging
      console.error('Refresh token error:', error);
      throw error; // Let the global exception filter handle it
    }
  }
}
