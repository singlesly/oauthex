import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHiveColumns1760473118478 implements MigrationInterface {
  name = 'AddHiveColumns1760473118478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "frames" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "strength" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "brood" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "devices" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "happiness" integer NOT NULL DEFAULT '0'
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "uterus_year" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "uterus_mark" integer
        `);
    await queryRunner.query(`
            ALTER TABLE "hives"
            ADD "uterus_breed" character varying
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "uterus_breed"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "uterus_mark"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "uterus_year"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "happiness"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "devices"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "brood"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "strength"
        `);
    await queryRunner.query(`
            ALTER TABLE "hives" DROP COLUMN "frames"
        `);
  }
}
