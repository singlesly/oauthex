import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClientSettings1769355401533 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "clients"
            ADD "settings" jsonb NOT NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "clients" DROP COLUMN "settings"
        `);
  }
}
