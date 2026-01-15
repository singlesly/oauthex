import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAttachments1759837322959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "attachments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "path" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "attachments"
        `);
  }
}
