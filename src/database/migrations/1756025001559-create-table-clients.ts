import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableClients1756025001559 implements MigrationInterface {
  name = 'CreateTableClients1756025001559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "clients" (
                "id" character varying NOT NULL,
                "realm_name" character varying,
                CONSTRAINT "pk_clients_id" PRIMARY KEY ("id")
            )
        `);
    await queryRunner.query(`
            ALTER TABLE "clients"
            ADD CONSTRAINT "FK_f18796e8d7187f197bc38a7fc78" FOREIGN KEY ("realm_name") REFERENCES "realms"("name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "clients" DROP CONSTRAINT "FK_f18796e8d7187f197bc38a7fc78"
        `);
    await queryRunner.query(`
            DROP TABLE "clients"
        `);
  }
}
