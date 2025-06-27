import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AxiosError } from 'axios';
import { PrismaService } from '../prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { User } from '@prisma/client';
import { IGitHubUser, IUserPayload } from './interfaces/github.interfaces';

@Injectable()
export class GithubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private readonly logger = new Logger(GithubService.name);

  async fetchAndStoreUser(username: string): Promise<User> {
    const userUrl = `https://api.github.com/users/${username}`;
    const reposUrl = `https://api.github.com/users/${username}/repos?per_page=100`;

    const { data: userData } = await firstValueFrom(
      this.httpService.get<IGitHubUser>(userUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response);

          if (error.response?.status === 404) {
            throw new NotFoundException(`GitHub user "${username}" not found`);
          }
          throw new InternalServerErrorException(
            'Error searching for user on GitHub',
          );
        }),
      ),
    );

    const { data: reposData } = await firstValueFrom(
      this.httpService.get(reposUrl).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response);

          if (error.response?.status === 404) {
            throw new NotFoundException(`GitHub user "${username}" not found`);
          }
          throw new InternalServerErrorException(
            'Error searching for user on GitHub',
          );
        }),
      ),
    );

    const languages = new Set<string>();
    for (const repo of reposData) {
      if (repo.language) languages.add(repo.language);
    }

    const userPayload: IUserPayload = {
      name: userData.name ?? userData.login,
      email: userData.email,
      location: userData.location,
      bio: userData.bio,
      avatarUrl: userData.avatar_url,
      url: userData.url,
      blog: userData.blog,
      languages: Array.from(languages),
    };

    const createdUser = await this.prisma.user.upsert({
      where: { githubId: userData.id },
      update: { ...userPayload },
      create: {
        githubId: userData.id,
        ...userPayload,
      },
    });

    return createdUser;
  }

  async findUsers(location?: string, language?: string): Promise<any> {
    return await this.prisma.user.findMany({
      where: {
        location: location
          ? { contains: location, mode: 'insensitive' }
          : undefined,
        languages: language ? { has: language } : undefined,
      },
    });
  }
}
