import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtApiaries1763112546341 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "apiaries"
            ADD "deleted_at" TIMESTAMP WITH TIME ZONE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "apiaries" DROP COLUMN "deleted_at"
        `);
  }
}
