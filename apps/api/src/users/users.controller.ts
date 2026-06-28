import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.usersService.findAll(companyId, query);
  }

  @Get('team-members')
  listTeamMembers(@CurrentUser('companyId') companyId: string) {
    return this.usersService.listTeamMembers(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.findOne(companyId, id);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.usersService.update(companyId, id, dto);
  }

  @Delete(':id')
  deactivate(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.usersService.deactivate(companyId, id);
  }
}
