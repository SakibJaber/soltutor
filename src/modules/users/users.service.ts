import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import { UploadService } from '../upload/upload.service';
import { PaginatedResponse } from '../../common/interfaces/pagination-response.interface';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/common/enum/user.role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private mail: MailService,
    private upload: UploadService,
    private config: ConfigService,
  ) {}

  async create(
    dto: CreateUserDto,
    options?: {
      sendCredentialsEmail?: boolean;
      plainPassword?: string;
      file?: Express.Multer.File;
    },
  ) {
    // Handle profile image upload if provided
    let profileImageUrl: string | undefined;
    if (options?.file) {
      const uploadResult = await this.upload.upload(options.file);
      // S3 returns 'url', local returns 'path'
      profileImageUrl =
        'url' in uploadResult ? uploadResult.url : uploadResult.path;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({
      ...dto,
      password: hashedPassword,
      profileImage: profileImageUrl || dto.profileImage,
    });
    const savedUser = await user.save();

    // Only send credentials email if explicitly requested (for admin-created users)
    if (options?.sendCredentialsEmail) {
      const passwordToSend = options.plainPassword || dto.password;
      this.mail
        .sendUserCredentialsEmail(
          savedUser.email,
          passwordToSend,
          savedUser.firstName,
          savedUser.lastName,
        )
        .catch((error) => {
          console.error('Failed to send credentials email:', error);
        });
    }

    return savedUser;
  }

  async findAll(
    page: number,
    limit: number,
    role?: string,
    isActive?: boolean,
    search?: string,
  ): Promise<PaginatedResponse<User>> {
    const query: any = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    const data = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const count = await this.userModel.countDocuments(query);

    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
        lastPage: Math.ceil(count / limit),
      },
    };
  }

  async findAllBySearch(search: string) {
    const searchRegex = new RegExp(search, 'i');
    return this.userModel
      .find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { email: searchRegex },
        ],
      })
      .exec();
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel
        .findById(id)
        .select('+refreshToken') // Include refreshToken in the result
        .maxTimeMS(2000) // 2 second timeout
        .exec();

      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      return null; // Return null instead of throwing to prevent guard failures
    }
  }

  async findByEmail(email: string, withPassword = false) {
    const query = this.userModel.findOne({ email });
    if (withPassword) {
      query.select('+password +refreshToken');
    } else {
      query.select('+refreshToken');
    }
    return query.exec();
  }

  async setRefreshToken(userId: string, hashedToken: string) {
    try {
      const result = await this.userModel.findByIdAndUpdate(
        userId,
        { refreshToken: hashedToken },
        { new: true },
      );

      if (!result) {
        throw new Error(`User with ID ${userId} not found`);
      }

      return result;
    } catch (error) {
      console.error('Error setting refresh token:', error);
      throw new Error('Failed to set refresh token');
    }
  }

  async clearRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async updateLastLogin(id: string) {
    await this.userModel.findByIdAndUpdate(id, { lastLogin: new Date() });
  }

  async saveOtp(email: string, otpCode: string, expires: Date) {
    await this.userModel.updateOne({ email }, { otpCode, otpExpires: expires });
  }

  async clearOtp(email: string) {
    await this.userModel.updateOne(
      { email },
      { otpCode: null, otpExpires: null },
    );
  }

  async verifyOtp(email: string, otp: string) {
    return this.userModel.findOne({
      email,
      otpCode: otp,
      otpExpires: { $gt: new Date() },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async updateProfile(userId: string, dto: any, file?: Express.Multer.File) {
    // Handle profile image upload if provided
    if (file) {
      const uploadResult = await this.upload.upload(file);
      dto.profileImage =
        'url' in uploadResult ? uploadResult.url : uploadResult.path;
    }

    // Hash password if being updated
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(userId, dto, {
      new: true,
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteProfile(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'Account deleted successfully' };
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async seedAdmin() {
    const adminEmail =
      this.config.get<string>('ADMIN_EMAIL') || 'admin@admin.com';
    const adminPassword =
      this.config.get<string>('ADMIN_PASSWORD') || 'admin1234';

    const existingAdmin = await this.userModel.findOne({ role: Role.ADMIN });
    if (existingAdmin) {
      console.log('Admin already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const admin = new this.userModel({
      firstName: 'System',
      lastName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      role: Role.ADMIN,
      isActive: true,
    });

    await admin.save();
    console.log(`Admin seeded successfully with email: ${adminEmail}`);
  }
}
