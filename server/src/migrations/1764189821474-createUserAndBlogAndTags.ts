import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeUserFieldsNullableAndAddProvider1765000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL, ALTER COLUMN "surname" DROP NOT NULL, ALTER COLUMN "password" DROP NOT NULL;`);

    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN "provider" character varying NOT NULL DEFAULT 'local',
      ADD COLUMN "googleId" character varying;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_users_email" ON "users" ("email");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "provider",
      DROP COLUMN "googleId";
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "name" SET NOT NULL,
      ALTER COLUMN "surname" SET NOT NULL,
      ALTER COLUMN "password" SET NOT NULL;
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_users_email";
    `);
  }
}
