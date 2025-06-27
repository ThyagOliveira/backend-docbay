import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import { of } from 'rxjs';

describe('GithubService', () => {
  let service: GithubService;
  let httpService: HttpService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
    httpService = module.get<HttpService>(HttpService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should fetch user data and store successfully', async () => {
    const mockUser = {
      gitHubId: 38231807,
      login: 'ThyagOliveira',
      name: 'Thyago Andrade de Oliveira',
      location: 'Porto, Portugal',
      bio: null,
      avatar_url: 'https://avatars.githubusercontent.com/u/38231807?v=4',
      email: null,
      url: 'https://github.com/ThyagOliveira',
      blog: 'https://www.linkedin.com/in/thyagoliveira/',
    };

    const mockRepos = [
      { language: 'JavaScript' },
      { language: 'TypeScript' },
      { language: null },
    ];

    (httpService.get as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/repos')) return of({ data: mockRepos });
      return of({ data: mockUser });
    });

    (prisma.user.upsert as jest.Mock).mockResolvedValue({
      id: 'user-id',
      ...mockUser,
      languages: ['JavaScript', 'TypeScript'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.fetchAndStoreUser('thyagoliveira');

    expect(result.name).toBe('Thyago Andrade de Oliveira');
    expect(result.languages).toContain('JavaScript');
    expect(prisma.user.upsert).toHaveBeenCalledTimes(1);
  });

  it('should update an existing user if githubId already exists', async () => {
    const mockUser = {
      gitHubId: 38231807,
      login: 'ThyagOliveira',
      name: 'Thyago Andrade de Oliveira',
      location: 'Porto, Portugal',
      bio: null,
      avatar_url: 'https://avatars.githubusercontent.com/u/38231807?v=4',
      email: null,
      url: 'https://github.com/ThyagOliveira',
      blog: 'https://www.linkedin.com/in/thyagoliveira/',
    };
    const mockRepos = [{ language: 'Python' }];

    (httpService.get as jest.Mock).mockImplementation((url: string) => {
      return url.includes('/repos')
        ? of({ data: mockRepos })
        : of({ data: mockUser });
    });

    const upsertMock = jest.fn().mockResolvedValue({
      ...mockUser,
      id: 'user-id',
      languages: ['Python'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    prisma.user.upsert = upsertMock;

    const result = await service.fetchAndStoreUser('thyagoliveira');

    expect(upsertMock).toHaveBeenCalledTimes(1);
    expect(result.languages).toEqual(['Python']);
  });
});
