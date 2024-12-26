export type CreateNoteDto = {
  name: string;
  content: string;
  userId: number;
  tags: number[];
  isArchived: boolean;
}

export type UpdateNoteDto = Partial<CreateNoteDto>;