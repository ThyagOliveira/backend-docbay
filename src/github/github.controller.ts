import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { FilterUserDto } from './dto/filter-user.dto';
import { ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('GitHub Users')
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post(':username')
  @ApiParam({ name: 'username', description: 'GitHub username to fetch' })
  @ApiResponse({
    status: 201,
    description: 'User created or updated successfully',
  })
  async fetchAndStore(@Param('username') username: string): Promise<any> {
    return this.githubService.fetchAndStoreUser(username);
  }

  @Get()
  @ApiQuery({ name: 'location', required: false })
  @ApiQuery({ name: 'language', required: false })
  @ApiResponse({ status: 200, description: 'List of GitHub users' })
  async find(@Query() query: FilterUserDto): Promise<any> {
    const { location, language, page, limit } = query;

    return this.githubService.findUsers(location, language, page, limit);
  }
}
