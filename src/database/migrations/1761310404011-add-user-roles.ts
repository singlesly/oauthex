import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoles1761310404011 implements MigrationInterface {
  name = 'AddUserRoles1761310404011';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "roles" character varying array NOT NULL DEFAULT '{client}'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "roles"
        `);
  }
}
