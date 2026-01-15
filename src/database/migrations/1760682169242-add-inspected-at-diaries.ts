import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInspectedAtDiaries1760682169242 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "diaries"
            ADD "inspected_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "diaries" DROP COLUMN "inspected_at"
        `);
  }
}
