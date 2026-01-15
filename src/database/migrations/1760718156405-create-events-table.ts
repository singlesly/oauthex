import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventsTable1760718156405 implements MigrationInterface {
  name = 'CreateEventsTable1760718156405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "calendar_events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "apiary_id" uuid NOT NULL,
                "hive_id" uuid NOT NULL,
                "start_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "end_at" TIMESTAMP WITH TIME ZONE NOT NULL,
                "notify_at" TIMESTAMP WITH TIME ZONE,
                "description" text,
                "created_by" uuid,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_faf5391d232322a87cdd1c6f30c" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD CONSTRAINT "FK_7f9a3d7f6217b99b6b2431887df" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD CONSTRAINT "FK_720a950eb0c7db4fd64dd977c63" FOREIGN KEY ("apiary_id") REFERENCES "apiaries"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events"
            ADD CONSTRAINT "FK_c043f8dfaf7cca403a123ed7f61" FOREIGN KEY ("hive_id") REFERENCES "hives"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP CONSTRAINT "FK_c043f8dfaf7cca403a123ed7f61"
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP CONSTRAINT "FK_720a950eb0c7db4fd64dd977c63"
        `);
    await queryRunner.query(`
            ALTER TABLE "calendar_events" DROP CONSTRAINT "FK_7f9a3d7f6217b99b6b2431887df"
        `);
    await queryRunner.query(`
            DROP TABLE "calendar_events"
        `);
  }
}
