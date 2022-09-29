import { PrismaService } from '@App/prisma/prisma.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '@App/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '@App/auth/dto';
import { EditUserDto } from '@App/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from '@App/bookmark/dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'vasa@gmail.com',
      passcode: '123',
    };
    describe('Signup', () => {
      it('Should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ passcode: dto.passcode })
          .expectStatus(400);
      });

      it('Should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('Should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('Should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Edit user', () => {
      const dto: EditUserDto = {
        email: 'vasa@gmail.com',
        firstName: 'Vladimir',
      };

      it('Should edit user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Create bookmark', () => {
      it('Should Create bookmark', () => {
        const dto: CreateBookmarkDto = {
          title: 'Bookmaek_1',
          link: 'jljghghghgh',
        };
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('Get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .expectStatus(200);
      });
    });

    describe('Get bookmark by id', () => {
      it('Get bookmark  by id', () => {
        return pactum
          .spec()
          .get('/bookmark/{id}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200);
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Bookmaek_11',
        link: 'jljghghghgh222',
      };

      it('Should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmark/{id}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .expectStatus(200);
      });
    });

    describe('Delete bookmark by id', () => {
      it('Should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmark/{id}')
          .withHeaders({ Authorization: 'Bearer $S{userAt}' })
          .withPathParams('id', '$S{bookmarkId}')
          .expectStatus(200);
      });
    });
  });
});
