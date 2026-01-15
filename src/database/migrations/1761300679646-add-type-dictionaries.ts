import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeDictionaries1761300679646 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "dictionaries"
            ADD "type" character varying NOT NULL DEFAULT 'DIARY'
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "dictionaries" DROP COLUMN "type"
        `);
  }
}
