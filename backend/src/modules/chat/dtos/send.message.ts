import { IsNotEmpty, IsString, IsUUID, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  @IsOptional()
  sessionId?: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
