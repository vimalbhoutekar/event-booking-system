import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  AuthenticatedRequest,
  BaseController,
  JwtAuthGuard,
  RolesGuard,
  UserType,
  Roles,
  AccessGuard,
  StorageService,
  File,
} from '@Common';
import { UsersService } from './users.service';
import {
  ChangePasswordRequestDto,
  GetUsersRequestDto,
  UpdateProfileImageRequestDto,
  UpdateUserProfileBaseRequestDto,
  UpdateUserProfileRequestDto,
  UpdateUserStatusDto,
} from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AccessGuard)
@Controller('users')
export class UsersController extends BaseController {
  constructor(
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {
    super();
  }

  @Roles(UserType.Admin)
  @UseGuards(RolesGuard)
  @Get()
  async getUsers(@Query() query: GetUsersRequestDto) {
    return await this.usersService.getAll({
      search: query.search,
      skip: query.skip,
      take: query.take,
    });
  }

  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    const ctx = this.getContext(req);
    return await this.usersService.getProfile(ctx.user.id);
  }

  @Patch('me')
  async updateProfileDetails(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateUserProfileBaseRequestDto,
  ) {
    if (data.mobile && (!data.dialCode || !data.country)) {
      throw new BadRequestException();
    }
    const ctx = this.getContext(req);
    await this.usersService.updateProfileDetails({
      userId: ctx.user.id,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      dialCode: data.dialCode,
      mobile: data.mobile,
      country: data.country,
      role: data.role,
    });
    return { status: 'success' };
  }

  @Roles(UserType.Admin)
  @UseGuards(RolesGuard)
  @Get(':userId')
  async getUserProfile(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getProfile(userId);
  }

  @Roles(UserType.Admin)
  @UseGuards(RolesGuard)
  @Patch(':userId')
  async updateUserProfileDetails(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() data: UpdateUserProfileRequestDto,
  ) {
    return await this.usersService.updateProfileDetailsByAdministrator({
      userId,
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      dialCode: data.dialCode,
      mobile: data.mobile,
      country: data.country,
      password: data.password,
    });
  }

  // ✅ Two-Step Upload: Update profile image with filename
  @Patch('me/profile-image')
  async updateProfileImage(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileImageRequestDto,
  ) {
    const ctx = this.getContext(req);

    // ✅ Validate file exists in storage root (uploaded but not yet moved)
    const fileExists = await this.storageService.exist(dto.filename);
    if (!fileExists) {
      throw new BadRequestException(
        'File not found. Please upload the file first using /upload endpoint.',
      );
    }

    // ✅ Service will move file to proper directory and update DB
    const result = await this.usersService.updateProfileImage(
      ctx.user.id,
      dto.filename,
    );

    return {
      success: true,
      profileImage: result.profileImage,
    };
  }

  @Post('me/change-password')
  async changePassword(
    @Req() req: AuthenticatedRequest,
    @Body() data: ChangePasswordRequestDto,
  ) {
    const ctx = this.getContext(req);
    await this.usersService.changePassword(
      ctx.user.id,
      data.oldPassword,
      data.newPassword,
    );
    return { status: 'success' };
  }

  @Roles(UserType.Admin)
  @UseGuards(RolesGuard)
  @Patch(':userId/status')
  async setUserStatus(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateUserStatusDto,
  ) {
    await this.usersService.setStatus(userId, dto.status);
    return { status: 'success' };
  }
}
