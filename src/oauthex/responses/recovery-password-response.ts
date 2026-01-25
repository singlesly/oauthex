import { ApiProperty } from '@nestjs/swagger';

export class RecoveryPasswordResponse {
  @ApiProperty({
    description: 'код для обмена на access token',
  })
  public readonly code!: string;
}
