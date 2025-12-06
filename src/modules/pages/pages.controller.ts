import { Controller, Get, Body, Put, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { UpdatePageDto } from './dto/update-page.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enum/user.role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PageType } from 'src/common/enum/pagetype.enum';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // Privacy Policy
  @Public()
  @Get('privacy-policy')
  getPrivacyPolicy() {
    return this.pagesService.get(PageType.PRIVACY_POLICY);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put('privacy-policy')
  updatePrivacyPolicy(@Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(PageType.PRIVACY_POLICY, updatePageDto);
  }

  // Terms and Conditions
  @Public()
  @Get('terms-and-conditions')
  getTermsAndConditions() {
    return this.pagesService.get(PageType.TERMS_AND_CONDITIONS);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put('terms-and-conditions')
  updateTermsAndConditions(@Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(
      PageType.TERMS_AND_CONDITIONS,
      updatePageDto,
    );
  }

  // About Us
  @Public()
  @Get('about-us')
  getAboutUs() {
    return this.pagesService.get(PageType.ABOUT_US);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put('about-us')
  updateAboutUs(@Body() updatePageDto: UpdatePageDto) {
    return this.pagesService.update(PageType.ABOUT_US, updatePageDto);
  }
}
