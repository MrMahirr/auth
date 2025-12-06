import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRefreshToken1765025600546 implements MigrationInterface {
  name = 'AddUserRefreshToken1765025600546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
  }
}
