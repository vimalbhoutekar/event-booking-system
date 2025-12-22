import { PartialType } from '@nestjs/swagger';
import { CreateEventRequestDto } from './create-event-request.dto';

/**
 * Update Event DTO
 * Makes all fields from CreateEventDto optional
 * Allows partial updates
 */
export class UpdateEventRequestDto extends PartialType(CreateEventRequestDto) {}
