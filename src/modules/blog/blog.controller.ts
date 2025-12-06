import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user.role.enum';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /**
   * Get all blog posts (Public)
   * Supports search by title and content
   */
  @Public()
  @Get()
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.blogService.findAll(
      page ? +page : 1,
      limit ? +limit : 10,
      search,
    );
  }

  /**
   * Get a single blog post by ID (Public)
   */
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  /**
   * Create a new blog post (Admin only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createBlogDto: CreateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.create(createBlogDto, file);
  }

  /**
   * Update a blog post (Admin only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogService.update(id, updateBlogDto, file);
  }

  /**
   * Delete a blog post (Admin only)
   */
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
