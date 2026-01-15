import { ApiProperty } from '@nestjs/swagger';

export class NotificationInviteMetadata {
  @ApiProperty()
  public readonly apiaryId: string;

  @ApiProperty()
  public readonly inviteId: string;

  @ApiProperty()
  public readonly userId: string;

  constructor(apiaryId: string, inviteId: string, userId: string) {
    this.apiaryId = apiaryId;
    this.inviteId = inviteId;
    this.userId = userId;
  }
}
