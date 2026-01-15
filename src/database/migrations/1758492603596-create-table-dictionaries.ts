import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableDictionaries1758492603596
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "dictionaries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP WITH TIME ZONE,
                "apiary_id" uuid,
                CONSTRAINT "PK_b864abffe7546b378d6ce4ba7c6" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "dictionaries"
            ADD CONSTRAINT "FK_45d4d88b801f3fcef2410cf3d39" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "dictionaries" DROP CONSTRAINT "FK_45d4d88b801f3fcef2410cf3d39"
        `);
    await queryRunner.query(`
            DROP TABLE "dictionaries"
        `);
  }
}
