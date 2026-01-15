import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRequests1764836106164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "method" character varying NOT NULL,
                "path" character varying NOT NULL,
                "body" jsonb NOT NULL,
                "query" jsonb NOT NULL,
                "headers" jsonb NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                CONSTRAINT "PK_0428f484e96f9e6a55955f29b5f" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "requests"
        `);
  }
}
