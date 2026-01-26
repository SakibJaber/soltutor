import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { TokenService } from './tokens/token.service';
import { UploadService } from '../upload/upload.service';
import { BadRequestException } from '@nestjs/common';

describe('AuthService Password Reset Flow', () => {
  let service: AuthService;
  let usersService: any;
  let tokenService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            saveOtp: jest.fn(),
            verifyOtp: jest.fn(),
            update: jest.fn(),
            clearOtp: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendOtpEmail: jest.fn(),
          },
        },
        {
          provide: TokenService,
          useValue: {
            signResetToken: jest.fn(),
            verifyResetToken: jest.fn(),
          },
        },
        {
          provide: UploadService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should complete the password reset flow', async () => {
    const email = 'test@example.com';
    const otp = '123456';
    const resetToken = 'valid_reset_token';
    const newPassword = 'newPassword123';

    // 1. Verify OTP
    usersService.verifyOtp.mockResolvedValue({ _id: 'user_id', email });
    tokenService.signResetToken.mockResolvedValue(resetToken);

    const verifyResult = await service.verifyOtp(email, otp);
    expect(verifyResult).toEqual({ message: 'OTP verified', resetToken });
    expect(tokenService.signResetToken).toHaveBeenCalledWith(email);

    // 2. Reset Password
    tokenService.verifyResetToken.mockResolvedValue({
      email,
      type: 'reset_password',
    });
    usersService.findByEmail.mockResolvedValue({ _id: 'user_id', email });
    usersService.update.mockResolvedValue({});
    usersService.clearOtp.mockResolvedValue({});

    const resetResult = await service.resetPassword({
      token: resetToken,
      newPassword,
    });
    expect(resetResult).toEqual({ message: 'Password updated successfully' });
    expect(usersService.update).toHaveBeenCalledWith('user_id', {
      password: newPassword,
    });
  });

  it('should throw error if token is invalid', async () => {
    tokenService.verifyResetToken.mockRejectedValue(new Error('Invalid token'));

    await expect(
      service.resetPassword({ token: 'invalid', newPassword: 'pass' }),
    ).rejects.toThrow(BadRequestException);
  });
});
