import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponse {
  @ApiProperty()
  public readonly code!: string;
}
