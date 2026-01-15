import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdColumnRequests1764836565419
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "requests"
            ADD "user_id" uuid NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "requests" DROP COLUMN "user_id"
        `);
  }
}
