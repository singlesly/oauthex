import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableNotifications1760777583021
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "notifications" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "text" character varying NOT NULL,
                "source" character varying NOT NULL,
                "status" character varying NOT NULL DEFAULT 'NEW',
                "type" character varying NOT NULL DEFAULT 'INFO',
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                "hive_id" uuid,
                CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "notifications"
            ADD CONSTRAINT "FK_8aee68e23770e975a8f5c726774" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "notifications" DROP CONSTRAINT "FK_8aee68e23770e975a8f5c726774"
        `);
    await queryRunner.query(`
            DROP TABLE "notifications"
        `);
  }
}
