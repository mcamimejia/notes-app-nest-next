export type CreateTagDto = {
    name: string;
};
  
export type UpdateTagDto = Partial<CreateTagDto>;