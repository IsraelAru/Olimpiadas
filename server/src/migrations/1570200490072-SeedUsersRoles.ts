import { MigrationInterface, QueryRunner, getRepository } from 'typeorm';
import { User } from '../domain/user.entity';
import { transformPassword } from '../security';
import { Authority } from '../domain/authority.entity';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
    role1: Authority = { name: 'ROLE_ADMIN' };

    role2: Authority = { name: 'ROLE_USER' };

    role3: Authority = { name: 'ROLE_MEDIC' };

    user1: User = {
        login: 'system',
        password: 'system',
        firstName: 'System',
        lastName: 'System',
        email: 'system@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    user2: User = {
        login: 'anonymoususer',
        password: 'anonymoususer',
        firstName: 'Anonymous',
        lastName: 'User',
        email: 'anonymoususer@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    user3: User = {
        login: '123',
        password: 'admin',
        firstName: 'Administrator',
        lastName: 'Administrator',
        email: 'admin@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    user4: User = {
        login: '1234',
        password: 'user',
        firstName: 'User',
        lastName: 'User',
        email: 'user@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'en',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };
    user5: User = {
        login: '12345',
        password: 'medic',
        firstName: 'User',
        lastName: 'User',
        email: 'medic@localhost.it',
        imageUrl: '',
        activated: true,
        langKey: 'es',
        createdBy: 'system',
        lastModifiedBy: 'system',
    };

    // eslint-disable-next-line
  public async up(queryRunner: QueryRunner): Promise<any> {
        const authorityRepository = getRepository('nhi_authority');

        const adminRole = await authorityRepository.save(this.role1);
        const userRole = await authorityRepository.save(this.role2);
        const medicRole = await authorityRepository.save(this.role3);

        const userRepository = getRepository('nhi_user');

        this.user1.authorities = [adminRole, userRole];
        this.user3.authorities = [adminRole, userRole];
        this.user4.authorities = [userRole];
        this.user5.authorities = [medicRole];

        await Promise.all([this.user1, this.user2, this.user3, this.user4, this.user5].map(u => transformPassword(u)));

        await userRepository.save([this.user1, this.user2, this.user3, this.user4, this.user5]);
    }

    // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> {}
}
