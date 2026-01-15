export class TokenRequestDto {
  grant_type!: 'authorization_code';
  authorization_code!: string;
  redirect_uri!: string;
  client_id!: string;
}
