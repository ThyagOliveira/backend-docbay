import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post(':username')
  async fetchAndStore(@Param('username') username: string): Promise<any> {
    return this.githubService.fetchAndStoreUser(username);
  }

  @Get()
  async find(@Query() query: FilterUserDto): Promise<any> {
    const { location, language } = query;

    return this.githubService.findUsers(location, language);
  }
}
