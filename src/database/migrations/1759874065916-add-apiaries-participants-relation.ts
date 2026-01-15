import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApiariesParticipantsRelation1759874065916
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "apiaries_participants" (
                "apiaries_id" uuid NOT NULL,
                "users_id" uuid NOT NULL,
                CONSTRAINT "PK_e1b3d43880c57f0678a11c64117" PRIMARY KEY ("apiaries_id", "users_id")
            )
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_19616d5ebaf42e2ff488f6bd37" ON "apiaries_participants" ("apiaries_id")
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_815844eb12f98f1d85966d01e0" ON "apiaries_participants" ("users_id")
        `);
    await queryRunner.query(`
            ALTER TABLE "apiaries_participants"
            ADD CONSTRAINT "FK_19616d5ebaf42e2ff488f6bd374" FOREIGN KEY ("apiaries_id") REFERENCES "apiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE "apiaries_participants"
            ADD CONSTRAINT "FK_815844eb12f98f1d85966d01e07" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "apiaries_participants" DROP CONSTRAINT "FK_815844eb12f98f1d85966d01e07"
        `);
    await queryRunner.query(`
            ALTER TABLE "apiaries_participants" DROP CONSTRAINT "FK_19616d5ebaf42e2ff488f6bd374"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_815844eb12f98f1d85966d01e0"
        `);
    await queryRunner.query(`
            DROP INDEX "public"."IDX_19616d5ebaf42e2ff488f6bd37"
        `);
    await queryRunner.query(`
            DROP TABLE "apiaries_participants"
        `);
  }
}
