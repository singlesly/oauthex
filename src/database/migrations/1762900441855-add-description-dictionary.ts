import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionDictionary1762900441855
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "dictionaries"
            ADD "description" text NOT NULL DEFAULT ''
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "dictionaries" DROP COLUMN "description"
        `);
  }
}
