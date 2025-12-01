import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from 'src/modules/mail/mail.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { TokenService } from './tokens/token.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private mail: MailService,
    private tokens: TokenService,
    private upload: UploadService,
  ) {}

  // REGISTER
  async register(dto: RegisterDto, file?: Express.Multer.File) {
    const exists = await this.users.findByEmail(dto.email);
    if (exists) throw new BadRequestException('Email already in use');

    // Handle profile image upload if provided
    let profileImageUrl: string | undefined;
    if (file) {
      const uploadResult = await this.upload.upload(file);
      // S3 returns 'url', local returns 'path'
      profileImageUrl =
        'url' in uploadResult ? uploadResult.url : uploadResult.path;
    }

    const user = await this.users.create({
      ...dto,
      profileImage: profileImageUrl,
    });
    const tokenData = await this.tokens.signTokens(
      user._id.toString(),
      user.role,
    );

    await this.users.setRefreshToken(
      user._id.toString(),
      await bcrypt.hash(tokenData.refreshToken, 10),
    );

    return { user, ...tokenData };
  }

  // LOGIN
  async login(dto: LoginDto) {
    const user: any = await this.users.findByEmail(dto.email, true);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await user.comparePassword(dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    if (!user.isActive) throw new UnauthorizedException('Account disabled');

    const tokenData = await this.tokens.signTokens(
      user._id.toString(),
      user.role,
    );

    await this.users.setRefreshToken(
      user._id.toString(),
      await bcrypt.hash(tokenData.refreshToken, 10),
    );

    return { user, ...tokenData };
  }

  // LOGOUT
  async logout(userId: string) {
    await this.users.clearRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  // REFRESH TOKEN
  async refresh(userId: string, refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const user = await this.users.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (!user.refreshToken) {
      throw new UnauthorizedException('No refresh token found for user');
    }

    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Generate new tokens
    const tokenData = await this.tokens.signTokens(userId, user.role);

    // Update refresh token in the database
    const hashedRefreshToken = await bcrypt.hash(tokenData.refreshToken, 10);
    await this.users.setRefreshToken(userId, hashedRefreshToken);

    return tokenData;
  }

  // SEND OTP
  async sendOtp(email: string) {
    const user = await this.users.findByEmail(email);
    if (!user) return { message: 'If email exists, OTP sent' };

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    await this.users.saveOtp(email, otp, expires);
    await this.mail.sendOtpEmail(email, otp);

    return { message: 'OTP sent' };
  }

  // VERIFY OTP
  async verifyOtp(email: string, otp: string) {
    const user = await this.users.verifyOtp(email, otp);
    if (!user) throw new BadRequestException('Invalid or expired OTP');

    return { message: 'OTP verified' };
  }

  // RESET PASSWORD
  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.users.verifyOtp(dto.email, dto.token);

    if (!user) throw new BadRequestException('Invalid or expired OTP');

    const hashed = await bcrypt.hash(dto.newPassword, 10);

    await this.users.update(user._id, { password: hashed });
    await this.users.clearOtp(user.email);

    return { message: 'Password updated successfully' };
  }
}
