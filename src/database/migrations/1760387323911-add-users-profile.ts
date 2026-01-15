import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUsersProfile1760387323911 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "profile_avatar_id" uuid
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD "profile_birthday" TIMESTAMP WITH TIME ZONE
        `);
    await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_a127c603b838fec351188ca54fa" FOREIGN KEY ("profile_avatar_id") REFERENCES "attachments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_a127c603b838fec351188ca54fa"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "profile_birthday"
        `);
    await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "profile_avatar_id"
        `);
  }
}
