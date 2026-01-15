import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUterusColorHives1760682454159 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "uterus_color" character varying NOT NULL DEFAULT ''
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "uterus_color"
        `);
  }
}
